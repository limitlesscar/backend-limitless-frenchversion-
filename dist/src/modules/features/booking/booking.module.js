"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_controller_1 = require("./booking.controller");
const booking_repository_1 = require("./repositories/booking.repository");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const host_entity_1 = require("../host/entities/host.entity");
const car_module_1 = require("../car/car.module");
const car_entity_1 = require("../car/entities/car.entity");
const notification_module_1 = require("../notification/notification.module");
const host_module_1 = require("../host/host.module");
const user_service_1 = require("../user/user.service");
const user_repository_1 = require("../user/repositories/user.repository");
const fcm_token_repository_1 = require("../user/repositories/fcm_token.repository");
const jwt_user_service_1 = require("../../core/jwt/services/jwt-user.service");
const jwt_1 = require("@nestjs/jwt");
const stripe_service_1 = require("../../stripe/stripe.service");
const user_entity_1 = require("../user/entities/user.entity");
const fcm_token_entity_1 = require("../user/entities/fcm_token.entity");
const chat_module_1 = require("../chat/chat.module");
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                booking_entity_1.BookingEntity,
                host_entity_1.HostEntity,
                car_entity_1.CarEntity,
                user_entity_1.UserEntity,
                fcm_token_entity_1.FcmTokenEntity,
            ]),
            car_module_1.CarModule,
            notification_module_1.NotificationModule,
            host_module_1.HostModule,
            chat_module_1.ChatModule,
        ],
        controllers: [booking_controller_1.BookingController],
        providers: [
            booking_service_1.BookingService,
            booking_repository_1.BookingRepository,
            user_service_1.UserService,
            user_repository_1.UserRepository,
            fcm_token_repository_1.FcmTokenRepository,
            jwt_user_service_1.JwtUserService,
            jwt_1.JwtService,
            stripe_service_1.StripeService,
        ],
        exports: [booking_repository_1.BookingRepository],
    })
], BookingModule);
//# sourceMappingURL=booking.module.js.map