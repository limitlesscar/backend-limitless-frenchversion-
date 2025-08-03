"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeModule = void 0;
const common_1 = require("@nestjs/common");
const stripe_controller_1 = require("./stripe.controller");
const stripe_service_1 = require("./stripe.service");
const host_module_1 = require("../features/host/host.module");
const booking_module_1 = require("../features/booking/booking.module");
const booking_service_1 = require("../features/booking/booking.service");
const typeorm_1 = require("@nestjs/typeorm");
const car_service_1 = require("../features/car/car.service");
const notification_service_1 = require("../features/notification/notification.service");
const host_entity_1 = require("../features/host/entities/host.entity");
const booking_entity_1 = require("../features/booking/entities/booking.entity");
const car_repository_1 = require("../features/car/repositories/car.repository");
const geocoding_service_1 = require("../core/google/geocoding/geocoding.service");
const chat_service_1 = require("../features/chat/chat.service");
const notification_repository_1 = require("../features/notification/repositories/notification.repository");
const car_entity_1 = require("../features/car/entities/car.entity");
const user_module_1 = require("../features/user/user.module");
const chat_repository_1 = require("../features/chat/repositories/chat.repository");
const user_chat_repository_1 = require("../features/chat/repositories/user_chat.repository");
const chat_message_repository_1 = require("../features/chat/repositories/chat_message.repository");
const notification_entity_1 = require("../features/notification/entities/notification.entity");
const chat_entity_1 = require("../features/chat/entities/chat.entity");
const user_chat_entity_1 = require("../features/chat/entities/user_chat.entity");
const chat_message_entity_1 = require("../features/chat/entities/chat_message.entity");
let StripeModule = class StripeModule {
};
exports.StripeModule = StripeModule;
exports.StripeModule = StripeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                host_entity_1.HostEntity,
                booking_entity_1.BookingEntity,
                car_entity_1.CarEntity,
                notification_entity_1.NotificationEntity,
                chat_entity_1.ChatEntity,
                user_chat_entity_1.UserChatsEntity,
                chat_message_entity_1.ChatMessageEntity,
            ]),
            host_module_1.HostModule,
            booking_module_1.BookingModule,
            user_module_1.UserModule,
        ],
        controllers: [stripe_controller_1.StripeController],
        providers: [
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
    })
], StripeModule);
//# sourceMappingURL=stripe.module.js.map