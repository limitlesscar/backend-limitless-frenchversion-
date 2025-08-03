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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const notification_repository_1 = require("./repositories/notification.repository");
const typeorm_1 = require("typeorm");
const notification_preference_1 = require("../user/enums/notification-preference");
const fcm_token_repository_1 = require("../user/repositories/fcm_token.repository");
let NotificationService = class NotificationService {
    constructor(notificationRepository, fcmTokenRepository) {
        this.notificationRepository = notificationRepository;
        this.fcmTokenRepository = fcmTokenRepository;
    }
    async create(notification) {
        const created = this.notificationRepository.create({ ...notification });
        const saved = await this.notificationRepository.save(created);
        return await this.notificationRepository.findOne({
            where: { id: saved.id },
            relations: { user: true },
            select: {
                user: {
                    id: true,
                    notification_preference: true,
                    profile_picture: true,
                },
            },
        });
    }
    async getAllNotificationsFromDB({ where, select, relations, order, skip, take, }) {
        return await this.notificationRepository.findAndCount({
            where,
            select,
            relations,
            order,
            skip,
            take,
        });
    }
    async removeUregisteredTokens(tokens) {
        if (!tokens?.length)
            return;
        const tokensToRemove = await this.fcmTokenRepository.find({
            where: { token: (0, typeorm_1.In)(tokens) },
        });
        await this.fcmTokenRepository.remove(tokensToRemove);
    }
    async sendNotification(notification) {
        const unregisteredTokens = [];
        try {
            const { data, fcmTokens } = notification;
            await this.create(data);
            if (data?.user?.notification_preference ===
                notification_preference_1.USER_NOTIFICATION_PREFERENCE.IN_APP) {
                console.log("Not sending notification as user has in app notification preference");
                return;
            }
            if (!fcmTokens?.length)
                return;
            const message = {
                data: {
                    body: data?.message,
                    navigateTo: data?.navigate_to || "",
                    resource_id: data?.resource_id || "",
                    profile_picture: data?.user?.profile_picture || "",
                },
                notification: {
                    body: data?.message,
                },
                tokens: fcmTokens,
            };
            const res = await admin.messaging().sendEachForMulticast(message);
            res?.responses?.forEach((response, index) => {
                if (response.error?.code === "messaging/registration-token-not-registered") {
                    unregisteredTokens.push(fcmTokens[index]);
                }
            });
            await this.removeUregisteredTokens(unregisteredTokens);
        }
        catch (error) {
            console.error(`Error in FirebaseService#sendNotification ${JSON.stringify({ error, notification })}`, error?.stack);
        }
    }
    async sendAdminNotification({ fcmTokens, message }) {
        try {
            if (!fcmTokens?.length)
                return;
            const body = {
                data: {
                    body: message,
                },
                notification: {
                    body: message,
                },
                tokens: fcmTokens,
            };
            return admin.messaging().sendEachForMulticast(body);
        }
        catch (error) {
            console.error(`Error in FirebaseService#sendNotification ${JSON.stringify({ error })}`, error?.stack);
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository,
        fcm_token_repository_1.FcmTokenRepository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map