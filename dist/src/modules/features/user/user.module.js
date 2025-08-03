"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const user_entity_1 = require("./entities/user.entity");
const user_repository_1 = require("./repositories/user.repository");
const fcm_token_repository_1 = require("./repositories/fcm_token.repository");
const fcm_token_entity_1 = require("./entities/fcm_token.entity");
const host_entity_1 = require("../host/entities/host.entity");
const host_service_1 = require("../host/host.service");
const host_repository_1 = require("../host/repositories/host.repository");
const jwt_user_service_1 = require("../../core/jwt/services/jwt-user.service");
const jwt_1 = require("@nestjs/jwt");
const booking_entity_1 = require("../booking/entities/booking.entity");
const booking_repository_1 = require("../booking/repositories/booking.repository");
const notification_entity_1 = require("../notification/entities/notification.entity");
const chat_entity_1 = require("../chat/entities/chat.entity");
const user_chat_entity_1 = require("../chat/entities/user_chat.entity");
const chat_message_entity_1 = require("../chat/entities/chat_message.entity");
const stripe_service_1 = require("../../stripe/stripe.service");
const booking_service_1 = require("../booking/booking.service");
const car_service_1 = require("../car/car.service");
const notification_service_1 = require("../notification/notification.service");
const car_repository_1 = require("../car/repositories/car.repository");
const geocoding_service_1 = require("../../core/google/geocoding/geocoding.service");
const chat_service_1 = require("../chat/chat.service");
const notification_repository_1 = require("../notification/repositories/notification.repository");
const car_entity_1 = require("../car/entities/car.entity");
const chat_repository_1 = require("../chat/repositories/chat.repository");
const user_chat_repository_1 = require("../chat/repositories/user_chat.repository");
const chat_message_repository_1 = require("../chat/repositories/chat_message.repository");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                host_entity_1.HostEntity,
                fcm_token_entity_1.FcmTokenEntity,
                booking_entity_1.BookingEntity,
                notification_entity_1.NotificationEntity,
                chat_entity_1.ChatEntity,
                user_chat_entity_1.UserChatsEntity,
                chat_message_entity_1.ChatMessageEntity,
                car_entity_1.CarEntity,
            ]),
        ],
        controllers: [user_controller_1.UserController],
        providers: [
            user_service_1.UserService,
            user_repository_1.UserRepository,
            host_service_1.HostService,
            host_repository_1.HostRepository,
            fcm_token_repository_1.FcmTokenRepository,
            booking_repository_1.BookingRepository,
            jwt_user_service_1.JwtUserService,
            jwt_1.JwtService,
            stripe_service_1.StripeService,
            booking_service_1.BookingService,
            car_service_1.CarService,
            notification_service_1.NotificationService,
            car_repository_1.CarRepository,
            geocoding_service_1.GeocodingService,
            chat_service_1.ChatService,
            notification_repository_1.NotificationRepository,
            chat_repository_1.ChatRepository,
            user_chat_repository_1.UserChatRepository,
            chat_message_repository_1.ChatMessageRepository,
        ],
        exports: [user_service_1.UserService, user_repository_1.UserRepository, fcm_token_repository_1.FcmTokenRepository],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map