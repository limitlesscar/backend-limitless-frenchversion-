import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { NotificationService } from "../notification/notification.service";
import { UserService } from "../user/user.service";
import { ChatType } from "./enums/chat-type.enum";
import { ChatService } from "./chat.service";
import { ISendMessageDto } from "./dto/send-message.dto";
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly configService;
    private readonly chatService;
    private readonly userService;
    private readonly notificationService;
    server: Server;
    constructor(jwtService: JwtService, configService: ConfigService, chatService: ChatService, userService: UserService, notificationService: NotificationService);
    afterInit(client: Socket): void;
    private logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom({ chat_id, receiver_id, chat_type, }: {
        chat_type: ChatType;
        chat_id: number;
        receiver_id: number;
    }, client: Socket): Promise<void>;
    handleMessage({ message, sender_id, chat_id }: ISendMessageDto, client: Socket): Promise<void>;
    private handleError;
}
