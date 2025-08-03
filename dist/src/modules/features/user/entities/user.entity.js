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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const otp_entity_1 = require("../../otp/entity/otp.entity");
const abstract_entity_1 = require("../../../database/abstract.entity");
const user_role_enum_1 = require("../enums/user-role.enum");
const user_onboarding_status_enum_1 = require("../enums/user-onboarding-status.enum");
const fcm_token_entity_1 = require("./fcm_token.entity");
const booking_entity_1 = require("../../booking/entities/booking.entity");
const host_entity_1 = require("../../host/entities/host.entity");
const notification_entity_1 = require("../../notification/entities/notification.entity");
const user_chat_entity_1 = require("../../chat/entities/user_chat.entity");
const chat_message_entity_1 = require("../../chat/entities/chat_message.entity");
const notification_preference_1 = require("../enums/notification-preference");
let UserEntity = class UserEntity extends abstract_entity_1.AbstractEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], UserEntity.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], UserEntity.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], UserEntity.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], UserEntity.prototype, "stripe_customer_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], UserEntity.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: user_role_enum_1.USER_TYPE_ENUM, array: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Array)
], UserEntity.prototype, "user_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: user_onboarding_status_enum_1.ONBOARDING_STATUS, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "user_onboarding_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: user_onboarding_status_enum_1.ONBOARDING_STATUS, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "host_onboarding_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "date_of_birth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "profile_picture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "id_card_front", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "emergency_contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "id_card_back", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "license_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "license_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        type: "geography",
        spatialFeatureType: "Point",
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "is_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "is_rejected", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "rejection_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: notification_preference_1.USER_NOTIFICATION_PREFERENCE,
        default: notification_preference_1.USER_NOTIFICATION_PREFERENCE.PUSH,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "notification_preference", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => otp_entity_1.OTPTableEntity, (otp) => otp.user, { cascade: true }),
    __metadata("design:type", Array)
], UserEntity.prototype, "otps", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => host_entity_1.HostEntity, (host) => host.user, { cascade: true }),
    __metadata("design:type", host_entity_1.HostEntity)
], UserEntity.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => fcm_token_entity_1.FcmTokenEntity, (fcm) => fcm.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "fcm_token", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.BookingEntity, (booking) => booking.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.NotificationEntity, (notification) => notification.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_chat_entity_1.UserChatsEntity, (user_chat) => user_chat.user, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], UserEntity.prototype, "chats", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_message_entity_1.ChatMessageEntity, (messages) => messages.sender),
    __metadata("design:type", Array)
], UserEntity.prototype, "messages", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)("user")
], UserEntity);
//# sourceMappingURL=user.entity.js.map