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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const swagger_1 = require("@nestjs/swagger");
const user_guard_1 = require("../../core/auth/guards/user.guard");
const common_type_1 = require("../../../types/common.type");
const common_dto_1 = require("../../../types/pagination/common.dto");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async AllNotifications({ skip, take }, { user }) {
        const [notifications, total] = await this.notificationService.getAllNotificationsFromDB({
            where: { user: { id: user?.id } },
            skip,
            take,
            order: { createdAt: "DESC" },
        });
        const hasMore = total > skip + notifications.length;
        return {
            notifications,
            hasMore,
        };
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, swagger_1.ApiOperation)({ summary: "Get all user notifications" }),
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "AllNotifications", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)("notification"),
    (0, swagger_1.ApiTags)("Notification"),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map