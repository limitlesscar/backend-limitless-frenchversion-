import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { BookingRepository } from "./repositories/booking.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingEntity } from "./entities/booking.entity";
import { HostEntity } from "../host/entities/host.entity";
import { CarModule } from "../car/car.module";
import { CarEntity } from "../car/entities/car.entity";
import { NotificationModule } from "../notification/notification.module";
import { HostModule } from "../host/host.module";
import { UserService } from "../user/user.service";
import { UserRepository } from "../user/repositories/user.repository";
import { FcmTokenRepository } from "../user/repositories/fcm_token.repository";
import { JwtUserService } from "src/modules/core/jwt/services/jwt-user.service";
import { JwtService } from "@nestjs/jwt";
import { StripeService } from "src/modules/stripe/stripe.service";
import { UserEntity } from "../user/entities/user.entity";
import { FcmTokenEntity } from "../user/entities/fcm_token.entity";
import { ChatModule } from "../chat/chat.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      HostEntity,
      CarEntity,
      UserEntity,
      FcmTokenEntity,
    ]),
    CarModule,
    NotificationModule,
    HostModule,
    ChatModule,
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingRepository,
    UserService,
    UserRepository,
    FcmTokenRepository,
    JwtUserService,
    JwtService,
    StripeService,
  ],
  exports: [BookingRepository],
})
export class BookingModule {}
