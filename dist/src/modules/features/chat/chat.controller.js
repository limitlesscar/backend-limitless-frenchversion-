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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const swagger_1 = require("@nestjs/swagger");
const user_guard_1 = require("../../core/auth/guards/user.guard");
const common_type_1 = require("../../../types/common.type");
const get_user_chats_dto_1 = require("./dto/get-user-chats.dto");
const common_dto_1 = require("../../../types/pagination/common.dto");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async fetchUserChats(fetchUserChatsDto, { user }) {
        return await this.chatService.getAllChats(fetchUserChatsDto, user);
    }
    async fetchMessages(id, paginationDto, { user }) {
        return await this.chatService.fetchMessagesOfChat(id, user, paginationDto);
    }
    async delete(id, { user }) {
        return await this.chatService.deleteChat(id, user);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Fetch all user chats by chat type and search" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_chats_dto_1.FetchUserChatsDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "fetchUserChats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Fetch all chat messages of a chat" }),
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("/:id/messages"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, common_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "fetchMessages", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete Chat" }),
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Delete)("/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "delete", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)("chat"),
    (0, swagger_1.ApiTags)("Chat"),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map