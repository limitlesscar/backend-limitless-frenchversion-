import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatMessageEntity } from "./entities/chat_message.entity";
import { ChatEntity } from "./entities/chat.entity";
import { UserChatsEntity } from "./entities/user_chat.entity";
import { JwtUserService } from "src/modules/core/jwt/services/jwt-user.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { NotificationService } from "../notification/notification.service";
import { ChatRepository } from "./repositories/chat.repository";
import { UserChatRepository } from "./repositories/user_chat.repository";
import { ChatMessageRepository } from "./repositories/chat_message.repository";
import { UserRepository } from "../user/repositories/user.repository";
import { FcmTokenRepository } from "../user/repositories/fcm_token.repository";
import { BookingRepository } from "../booking/repositories/booking.repository";
import { UserModule } from "../user/user.module";
import { HostModule } from "../host/host.module";
import { NotificationModule } from "../notification/notification.module";
import { BookingModule } from "../booking/booking.module";
import { CarModule } from "../car/car.module";
import { BookingEntity } from "../booking/entities/booking.entity";
import { ChatController } from "./chat.controller";
import { StripeService } from "src/modules/stripe/stripe.service";
import { BookingService } from "../booking/booking.service";
import { CarService } from "../car/car.service";
import { CarRepository } from "../car/repositories/car.repository";
import { GeocodingService } from "src/modules/core/google/geocoding/geocoding.service";
import { CarEntity } from "../car/entities/car.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatEntity,
      UserChatsEntity,
      ChatMessageEntity,
      BookingEntity,
      CarEntity,
    ]),
    UserModule,
    HostModule,

    NotificationModule,
  ],
  providers: [
    ChatGateway,
    StripeService,
    BookingService,
    CarService,
    CarRepository,
    CarService,
    ChatService,
    JwtUserService,
    JwtService,
    UserService,
    GeocodingService,
    ChatRepository,
    UserChatRepository,
    ChatMessageRepository,
    BookingRepository,
  ],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
