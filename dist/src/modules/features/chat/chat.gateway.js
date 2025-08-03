"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const websockets_middleware_1 = require("../../../middlewares/websockets.middleware");
const notification_service_1 = require("../notification/notification.service");
const user_service_1 = require("../user/user.service");
const chat_service_1 = require("./chat.service");
const send_message_dto_1 = require("./dto/send-message.dto");
const constants_1 = require("../notification/constants");
let ChatGateway = class ChatGateway {
    constructor(jwtService, configService, chatService, userService, notificationService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.chatService = chatService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger("ChatGateway");
    }
    afterInit(client) {
        const socketAuthMiddleware = new websockets_middleware_1.SocketAuthMiddleware(this.jwtService, this.configService);
        client.use(socketAuthMiddleware.use.bind(socketAuthMiddleware));
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinRoom({ chat_id, receiver_id, chat_type, }, client) {
        try {
            const token = client.handshake.headers.authorization.split(" ")[1];
            const sender = await this.userService.validateUserFromToken(token);
            if (sender.id === receiver_id) {
                client.emit("error", {
                    message: "You cannot chat with yourself",
                });
            }
            const chat = await this.chatService.findChatBetweenUsers(sender?.id, receiver_id, chat_id, chat_type);
            const roomId = chat?.id?.toString();
            client.join(roomId);
            this.logger.log(`User ${sender?.full_name} joined room: ${roomId}`);
            client.emit("joinedRoom", { roomId });
        }
        catch (error) {
            console.log(error);
            this.logger.error(error.message);
            client.emit("error", {
                message: JSON.stringify(error.response?.message),
            });
        }
    }
    async handleMessage({ message, sender_id, chat_id }, client) {
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
            const sent_message = await this.chatService.createChatMessage(message, chat_id, sender_id);
            this.logger.log(`Broadcasting message from ${client.id} to chat-${chat.id} except sender`);
            const receiver_chat = chat.user_chat.find((user_chat) => user_chat.user.id !== sender_id);
            const sender = await this.userService.getUserFromDB({
                where: { id: sender_id },
                select: { id: true, first_name: true },
            });
            const fcm_tokens = await this.userService.getUserFcmTokens(receiver_chat?.user.id);
            let receiverInChat = false;
            client.nsp.sockets.forEach((socket) => {
                if (socket.rooms.has(`${chat_id}`) &&
                    socket.data.userId === receiver_chat?.user.id) {
                    receiverInChat = true;
                }
            });
            if (fcm_tokens.length > 0 && !receiverInChat) {
                await this.notificationService.sendNotification({
                    fcmTokens: fcm_tokens,
                    data: {
                        message: constants_1.NOTIFICATIONS_MESSAGES.NEW_MESSAGE(sender.first_name)
                            .message,
                        navigate_to: "chat",
                        resource_id: chat_id.toString(),
                        user: receiver_chat?.user,
                    },
                });
            }
            this.server
                .to(`${chat.id}`)
                .emit("newMessage", sent_message);
        }
        else {
            this.server
                .to(`${chat.id}`)
                .emit("error", "You are not allowed to send messages in this chat");
        }
    }
    handleError(client, error) {
        client.emit("error", { message: error.message || "Unknown error" });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _c : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("joinRoom"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("sendMessage"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.ISendMessageDto, typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("error"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleError", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "chat",
        cors: {
            origin: ["*"],
            methods: ["GET", "POST"],
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, chat_service_1.ChatService,
        user_service_1.UserService,
        notification_service_1.NotificationService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map