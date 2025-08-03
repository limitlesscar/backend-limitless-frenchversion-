import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./entities/notification.entity";
import { NotificationRepository } from "./repositories/notification.repository";
import { firebaseConfig } from "src/config/firebase.config";
import { FcmTokenRepository } from "../user/repositories/fcm_token.repository";
import { FcmTokenEntity } from "../user/entities/fcm_token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, FcmTokenEntity])],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    firebaseConfig,
    FcmTokenRepository,
  ],
  exports: [NotificationRepository, NotificationService],
})
export class NotificationModule {}
