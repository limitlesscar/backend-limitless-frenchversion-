import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { BookingModule } from "../booking/booking.module";
import { BookingService } from "../booking/booking.service";
import { NotificationModule } from "../notification/notification.module";
import { HostModule } from "../host/host.module";
import { CarModule } from "../car/car.module";
import { JwtService } from "@nestjs/jwt";
import { JwtUserService } from "src/modules/core/jwt/services/jwt-user.service";
import { StripeService } from "src/modules/stripe/stripe.service";
import { FcmTokenRepository } from "../user/repositories/fcm_token.repository";
import { UserRepository } from "../user/repositories/user.repository";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/entities/user.entity";
import { FcmTokenEntity } from "../user/entities/fcm_token.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatModule } from "../chat/chat.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FcmTokenEntity]),
    BookingModule,
    NotificationModule,
    HostModule,
    CarModule,
    ChatModule,
  ],
  providers: [
    CronService,
    BookingService,
    UserService,
    UserRepository,
    FcmTokenRepository,
    JwtUserService,
    JwtService,
    StripeService,
  ],
})
export class CronModule {}
