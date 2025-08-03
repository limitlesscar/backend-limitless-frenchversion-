// Nest JS
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// Services
import { UserService } from "./user.service";

// Controllers
import { UserController } from "./user.controller";

// Entities
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { FcmTokenRepository } from "./repositories/fcm_token.repository";
import { FcmTokenEntity } from "./entities/fcm_token.entity";
import { HostEntity } from "../host/entities/host.entity";
import { HostService } from "../host/host.service";
import { HostRepository } from "../host/repositories/host.repository";
import { JwtUserService } from "src/modules/core/jwt/services/jwt-user.service";
import { JwtService } from "@nestjs/jwt";
import { BookingModule } from "../booking/booking.module";
import { BookingEntity } from "../booking/entities/booking.entity";
import { BookingRepository } from "../booking/repositories/booking.repository";
import { NotificationEntity } from "../notification/entities/notification.entity";
import { ChatEntity } from "../chat/entities/chat.entity";
import { UserChatsEntity } from "../chat/entities/user_chat.entity";
import { ChatMessageEntity } from "../chat/entities/chat_message.entity";
import { StripeModule } from "src/modules/stripe/stripe.module";
import { StripeService } from "src/modules/stripe/stripe.service";
import { BookingService } from "../booking/booking.service";
import { CarService } from "../car/car.service";
import { NotificationService } from "../notification/notification.service";
import { CarRepository } from "../car/repositories/car.repository";
import { GeocodingService } from "src/modules/core/google/geocoding/geocoding.service";
import { ChatService } from "../chat/chat.service";
import { NotificationRepository } from "../notification/repositories/notification.repository";
import { CarEntity } from "../car/entities/car.entity";
import { ChatRepository } from "../chat/repositories/chat.repository";
import { UserChatRepository } from "../chat/repositories/user_chat.repository";
import { ChatMessageRepository } from "../chat/repositories/chat_message.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      HostEntity,
      FcmTokenEntity,
      BookingEntity,
      NotificationEntity,
      ChatEntity,
      UserChatsEntity,
      ChatMessageEntity,
      CarEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    HostService,
    HostRepository,
    FcmTokenRepository,
    BookingRepository,
    JwtUserService,
    JwtService,
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
  exports: [UserService, UserRepository, FcmTokenRepository],
})
export class UserModule {}
