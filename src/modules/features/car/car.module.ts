import { Module } from "@nestjs/common";
import { CarService } from "./car.service";
import { CarController } from "./car.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarEntity } from "./entities/car.entity";
import { CarRepository } from "./repositories/car.repository";
import { GeocodingService } from "src/modules/core/google/geocoding/geocoding.service";
import { BookingEntity } from "../booking/entities/booking.entity";
import { BookingService } from "../booking/booking.service";
import { BookingRepository } from "../booking/repositories/booking.repository";
import { HostEntity } from "../host/entities/host.entity";
import { HostService } from "../host/host.service";
import { HostRepository } from "../host/repositories/host.repository";
import { NotificationEntity } from "../notification/entities/notification.entity";
import { NotificationModule } from "../notification/notification.module";
import { ChatModule } from "../chat/chat.module";
import { UserService } from "../user/user.service";
import { UserRepository } from "../user/repositories/user.repository";
import { FcmTokenRepository } from "../user/repositories/fcm_token.repository";
import { UserModule } from "../user/user.module";
import { JwtUserService } from "src/modules/core/jwt/services/jwt-user.service";
import { StripeService } from "src/modules/stripe/stripe.service";
import { UserEntity } from "../user/entities/user.entity";
import { FcmTokenEntity } from "../user/entities/fcm_token.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarEntity,
      BookingEntity,
      HostEntity,
      NotificationEntity,
      UserEntity,
      FcmTokenEntity,
    ]),
    NotificationModule,
    ChatModule,
  ],
  controllers: [CarController],
  providers: [
    CarService,
    UserService,
    UserRepository,
    FcmTokenRepository,
    JwtUserService,
    JwtService,
    StripeService,
    CarRepository,
    GeocodingService,
    BookingService,
    BookingRepository,
    HostService,
    HostRepository,
  ],
  exports: [CarService, CarRepository, GeocodingService],
})
export class CarModule {}
