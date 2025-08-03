import { HttpStatus, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketAuthMiddleware } from "src/middlewares/websockets.middleware";

import { NotificationService } from "../notification/notification.service";
import { UserService } from "../user/user.service";
import { ChatType } from "./enums/chat-type.enum";
import { ChatService } from "./chat.service";
import { ISendMessageDto } from "./dto/send-message.dto";
import { NOTIFICATIONS_MESSAGES } from "../notification/constants";

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
})
/**
 * WebSocket gateway for handling real-time chat functionality
 *
 * @class
 * @description Manages WebSocket connections, room joining, message sending, and error handling for chat interactions
 * @implements {OnGatewayConnection}
 * @implements {OnGatewayDisconnect}
 */
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * @description Initializes socket authentication middleware after WebSocket server initialization
   *
   * @param {Socket} client - The socket client to apply authentication middleware
   *
   * @return {void} No return value
   */
  afterInit(client: Socket): void {
    const socketAuthMiddleware = new SocketAuthMiddleware(
      this.jwtService,
      this.configService,
    );

    client.use(socketAuthMiddleware.use.bind(socketAuthMiddleware));
  }

  private logger: Logger = new Logger("ChatGateway");

  // =================================================== Handle connection ===================================================
  /**
   * @description This function handles a user connecting to the chat room.
   *
   * @param {Socket} client - The connected socket client.
   *
   * @return {void} No return value.
   *
   * @example
   * const clientSocket = io.connect('http://example.com');
   * handleConnection(clientSocket);
   */
  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // =================================================== Handle disconnection ===================================================
  /**
   * @description This function handles a user disconnecting from the chat room.
   *
   * @param {Socket} client - The connected socket client.
   *
   * @return {void} No return value.
   *
   * @example
   * const clientSocket = io.connect('http://example.com');
   * handleDisconnect(clientSocket);
   */
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // =================================================== Handle join room ===================================================

  @SubscribeMessage("joinRoom")
  async handleJoinRoom(
    @MessageBody()
    {
      chat_id,
      receiver_id,
      chat_type,
    }: { chat_type: ChatType; chat_id: number; receiver_id: number },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const token = client.handshake.headers.authorization.split(
        " ",
      )[1] as string;
      const sender = await this.userService.validateUserFromToken(token);
      if (sender.id === receiver_id) {
        client.emit("error", {
          message: "You cannot chat with yourself",
        });
      }

      const chat = await this.chatService.findChatBetweenUsers(
        sender?.id,
        receiver_id,
        chat_id,
        chat_type,
      );

      const roomId = chat?.id?.toString();
      client.join(roomId);

      this.logger.log(`User ${sender?.full_name} joined room: ${roomId}`);
      client.emit("joinedRoom", { roomId });
    } catch (error) {
      console.log(error);
      this.logger.error(error.message);
      client.emit("error", {
        message: JSON.stringify(error.response?.message),
      });
    }
  }
  // =================================================== Handle send message ===================================================

  @SubscribeMessage("sendMessage")
  async handleMessage(
    @MessageBody() { message, sender_id, chat_id }: ISendMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const chat = await this.chatService.getChatFromDB({
      where: { id: chat_id },
      select: {
        user_chat: true,
      },
      relations: { user_chat: { user: { fcm_token: true } } },
      withDeleted: true,
    });
    const canChat = await this.chatService.canChat(sender_id, chat);
    if (canChat) {
      const sent_message = await this.chatService.createChatMessage(
        message,
        chat_id,
        sender_id,
      );
      // SEND NOTIFICATION TO RECEIVER
      this.logger.log(
        `Broadcasting message from ${client.id} to chat-${chat.id} except sender`,
      );
      const receiver_chat = chat.user_chat.find(
        (user_chat) => user_chat.user.id !== sender_id,
      );
      const sender = await this.userService.getUserFromDB({
        where: { id: sender_id },
        select: { id: true, first_name: true },
      });
      const fcm_tokens = await this.userService.getUserFcmTokens(
        receiver_chat?.user.id,
      );
      let receiverInChat = false;

      client.nsp.sockets.forEach((socket) => {
        if (
          socket.rooms.has(`${chat_id}`) &&
          socket.data.userId === receiver_chat?.user.id
        ) {
          receiverInChat = true;
        }
      });
      if (fcm_tokens.length > 0 && !receiverInChat) {
        await this.notificationService.sendNotification({
          fcmTokens: fcm_tokens,
          data: {
            message: NOTIFICATIONS_MESSAGES.NEW_MESSAGE(sender.first_name)
              .message,
            navigate_to: "chat",
            resource_id: chat_id.toString(),
            user: receiver_chat?.user,
          },
        });
      }
      // Emit the message to all clients in the chat room
      this.server
        .to(`${chat.id}`)
        // .except(client.id)
        .emit("newMessage", sent_message);
    } else {
      this.server
        .to(`${chat.id}`)
        // .except(client.id)
        .emit("error", "You are not allowed to send messages in this chat");
    }
  }

  @SubscribeMessage("error")
  private handleError(@ConnectedSocket() client: Socket, error: any): void {
    client.emit("error", { message: error.message || "Unknown error" });
  }
}
