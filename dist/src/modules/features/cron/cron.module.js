"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronModule = void 0;
const common_1 = require("@nestjs/common");
const cron_service_1 = require("./cron.service");
const booking_module_1 = require("../booking/booking.module");
const booking_service_1 = require("../booking/booking.service");
const notification_module_1 = require("../notification/notification.module");
const host_module_1 = require("../host/host.module");
const car_module_1 = require("../car/car.module");
const jwt_1 = require("@nestjs/jwt");
const jwt_user_service_1 = require("../../core/jwt/services/jwt-user.service");
const stripe_service_1 = require("../../stripe/stripe.service");
const fcm_token_repository_1 = require("../user/repositories/fcm_token.repository");
const user_repository_1 = require("../user/repositories/user.repository");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../user/entities/user.entity");
const fcm_token_entity_1 = require("../user/entities/fcm_token.entity");
const typeorm_1 = require("@nestjs/typeorm");
const chat_module_1 = require("../chat/chat.module");
let CronModule = class CronModule {
};
exports.CronModule = CronModule;
exports.CronModule = CronModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, fcm_token_entity_1.FcmTokenEntity]),
            booking_module_1.BookingModule,
            notification_module_1.NotificationModule,
            host_module_1.HostModule,
            car_module_1.CarModule,
            chat_module_1.ChatModule,
        ],
        providers: [
            cron_service_1.CronService,
            booking_service_1.BookingService,
            user_service_1.UserService,
            user_repository_1.UserRepository,
            fcm_token_repository_1.FcmTokenRepository,
            jwt_user_service_1.JwtUserService,
            jwt_1.JwtService,
            stripe_service_1.StripeService,
        ],
    })
], CronModule);
//# sourceMappingURL=cron.module.js.map