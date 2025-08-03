import { Module } from "@nestjs/common";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";
import { HostModule } from "../features/host/host.module";
import { BookingModule } from "../features/booking/booking.module";
import { HostService } from "../features/host/host.service";
import { BookingService } from "../features/booking/booking.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HostRepository } from "../features/host/repositories/host.repository";
import { BookingRepository } from "../features/booking/repositories/booking.repository";
import { CarService } from "../features/car/car.service";
import { NotificationService } from "../features/notification/notification.service";
import { HostEntity } from "../features/host/entities/host.entity";
import { BookingEntity } from "../features/booking/entities/booking.entity";
import { CarRepository } from "../features/car/repositories/car.repository";
import { GeocodingService } from "../core/google/geocoding/geocoding.service";
import { ChatService } from "../features/chat/chat.service";
import { NotificationRepository } from "../features/notification/repositories/notification.repository";
import { CarEntity } from "../features/car/entities/car.entity";
import { UserModule } from "../features/user/user.module";
import { ChatRepository } from "../features/chat/repositories/chat.repository";
import { UserChatRepository } from "../features/chat/repositories/user_chat.repository";
import { ChatMessageRepository } from "../features/chat/repositories/chat_message.repository";
import { UserService } from "../features/user/user.service";
import { UserRepository } from "../features/user/repositories/user.repository";
import { FcmTokenRepository } from "../features/user/repositories/fcm_token.repository";
import { NotificationEntity } from "../features/notification/entities/notification.entity";
import { ChatEntity } from "../features/chat/entities/chat.entity";
import { UserChatsEntity } from "../features/chat/entities/user_chat.entity";
import { ChatMessageEntity } from "../features/chat/entities/chat_message.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HostEntity,
      BookingEntity,
      CarEntity,
      NotificationEntity,
      ChatEntity,
      UserChatsEntity,
      ChatMessageEntity,
    ]),
    HostModule,
    BookingModule,
    UserModule,
  ],
  controllers: [StripeController],
  providers: [
    StripeService,
    BookingService,
    CarService,
    NotificationService,
    CarRepository,
    GeocodingService,
    ChatService,
    NotificationRepository,
    ChatRepository,
    UserChatRepository,
    ChatMessageRepository,
  ],
})
export class StripeModule {}
