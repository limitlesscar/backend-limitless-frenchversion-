// Nest JS
import { Module } from "@nestjs/common";
// Services
import { AuthService } from "./service/user-auth.service";
// Controllers
import { AuthController } from "./controller/user-auth.controller";
// Strategies
import { JwtUserStrategy } from "./strategy/user.strategy";
import { JwtAdminStrategy } from "./strategy/admin.strategy";
// Modules
import { UserModule } from "src/modules/features/user/user.module";
import { JwtModule } from "../jwt/jwt.module";
import { OtpModule } from "src/modules/features/otp/otp.module";
import { NotificationService } from "src/modules/features/notification/notification.service";
import { NotificationRepository } from "src/modules/features/notification/repositories/notification.repository";
import { NotificationEntity } from "src/modules/features/notification/entities/notification.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminRepository } from "src/modules/features/admin/repositories/admin.repository";
import { AdminEntity } from "src/modules/features/admin/entities/admin.entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, AdminEntity]),
    UserModule,
    JwtModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtUserStrategy,
    JwtAdminStrategy,
    AuthService,
    NotificationService,
    NotificationRepository,
    AdminRepository,
  ],
})
export class AuthModule {}
