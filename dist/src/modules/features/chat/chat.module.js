"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_gateway_1 = require("./chat.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const chat_message_entity_1 = require("./entities/chat_message.entity");
const chat_entity_1 = require("./entities/chat.entity");
const user_chat_entity_1 = require("./entities/user_chat.entity");
const jwt_user_service_1 = require("../../core/jwt/services/jwt-user.service");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const chat_repository_1 = require("./repositories/chat.repository");
const user_chat_repository_1 = require("./repositories/user_chat.repository");
const chat_message_repository_1 = require("./repositories/chat_message.repository");
const booking_repository_1 = require("../booking/repositories/booking.repository");
const user_module_1 = require("../user/user.module");
const host_module_1 = require("../host/host.module");
const notification_module_1 = require("../notification/notification.module");
const booking_entity_1 = require("../booking/entities/booking.entity");
const chat_controller_1 = require("./chat.controller");
const stripe_service_1 = require("../../stripe/stripe.service");
const booking_service_1 = require("../booking/booking.service");
const car_service_1 = require("../car/car.service");
const car_repository_1 = require("../car/repositories/car.repository");
const geocoding_service_1 = require("../../core/google/geocoding/geocoding.service");
const car_entity_1 = require("../car/entities/car.entity");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                chat_entity_1.ChatEntity,
                user_chat_entity_1.UserChatsEntity,
                chat_message_entity_1.ChatMessageEntity,
                booking_entity_1.BookingEntity,
                car_entity_1.CarEntity,
            ]),
            user_module_1.UserModule,
            host_module_1.HostModule,
            notification_module_1.NotificationModule,
        ],
        providers: [
            chat_gateway_1.ChatGateway,
            stripe_service_1.StripeService,
            booking_service_1.BookingService,
            car_service_1.CarService,
            car_repository_1.CarRepository,
            car_service_1.CarService,
            chat_service_1.ChatService,
            jwt_user_service_1.JwtUserService,
            jwt_1.JwtService,
            user_service_1.UserService,
            geocoding_service_1.GeocodingService,
            chat_repository_1.ChatRepository,
            user_chat_repository_1.UserChatRepository,
            chat_message_repository_1.ChatMessageRepository,
            booking_repository_1.BookingRepository,
        ],
        exports: [chat_service_1.ChatService],
        controllers: [chat_controller_1.ChatController],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map