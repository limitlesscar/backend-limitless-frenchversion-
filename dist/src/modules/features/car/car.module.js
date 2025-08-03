"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarModule = void 0;
const common_1 = require("@nestjs/common");
const car_service_1 = require("./car.service");
const car_controller_1 = require("./car.controller");
const typeorm_1 = require("@nestjs/typeorm");
const car_entity_1 = require("./entities/car.entity");
const car_repository_1 = require("./repositories/car.repository");
const geocoding_service_1 = require("../../core/google/geocoding/geocoding.service");
const booking_entity_1 = require("../booking/entities/booking.entity");
const booking_service_1 = require("../booking/booking.service");
const booking_repository_1 = require("../booking/repositories/booking.repository");
const host_entity_1 = require("../host/entities/host.entity");
const host_service_1 = require("../host/host.service");
const host_repository_1 = require("../host/repositories/host.repository");
const notification_entity_1 = require("../notification/entities/notification.entity");
const notification_module_1 = require("../notification/notification.module");
const chat_module_1 = require("../chat/chat.module");
const user_service_1 = require("../user/user.service");
const user_repository_1 = require("../user/repositories/user.repository");
const fcm_token_repository_1 = require("../user/repositories/fcm_token.repository");
const jwt_user_service_1 = require("../../core/jwt/services/jwt-user.service");
const stripe_service_1 = require("../../stripe/stripe.service");
const user_entity_1 = require("../user/entities/user.entity");
const fcm_token_entity_1 = require("../user/entities/fcm_token.entity");
const jwt_1 = require("@nestjs/jwt");
let CarModule = class CarModule {
};
exports.CarModule = CarModule;
exports.CarModule = CarModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                car_entity_1.CarEntity,
                booking_entity_1.BookingEntity,
                host_entity_1.HostEntity,
                notification_entity_1.NotificationEntity,
                user_entity_1.UserEntity,
                fcm_token_entity_1.FcmTokenEntity,
            ]),
            notification_module_1.NotificationModule,
            chat_module_1.ChatModule,
        ],
        controllers: [car_controller_1.CarController],
        providers: [
            car_service_1.CarService,
            user_service_1.UserService,
            user_repository_1.UserRepository,
            fcm_token_repository_1.FcmTokenRepository,
            jwt_user_service_1.JwtUserService,
            jwt_1.JwtService,
            stripe_service_1.StripeService,
            car_repository_1.CarRepository,
            geocoding_service_1.GeocodingService,
            booking_service_1.BookingService,
            booking_repository_1.BookingRepository,
            host_service_1.HostService,
            host_repository_1.HostRepository,
        ],
        exports: [car_service_1.CarService, car_repository_1.CarRepository, geocoding_service_1.GeocodingService],
    })
], CarModule);
//# sourceMappingURL=car.module.js.map