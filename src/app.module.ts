// Nest JS Imports
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
// Controller Imports
// Service Imports
import { AppService } from "./app.service";
// Module Imports
import { AuthModule } from "./modules/core/auth/auth.module";
import { MailModule } from "./modules/core/mail/mail.module";
import { JwtModule } from "./modules/core/jwt/jwt.module";
// import { PostgreSQLConfig } from "./config/database/orm.config";
import { DatabaseModule } from "./modules/database/database.module";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/loaders/app.config";
import smtpConfig from "./config/loaders/smtp.config";
import databaseConfig from "./config/loaders/database.config";
import { TrimMiddleware } from "./middlewares/trim-body.middleware";
import { UserModule } from "./modules/features/user/user.module";
import { CarModule } from "./modules/features/car/car.module";
import { BookingModule } from "./modules/features/booking/booking.module";
import { HostModule } from "./modules/features/host/host.module";
import { UploadModule } from "./modules/features/upload/upload.module";
import { ChatModule } from "./modules/features/chat/chat.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CronModule } from "./modules/features/cron/cron.module";
import { StripeModule } from "./modules/stripe/stripe.module";
import { TermsAndConditionsModule } from "./modules/features/terms_and_conditions/terms_and_conditions.module";
import { AdminModule } from "./modules/features/admin/admin.module";
@Module({
  imports: [
    /** Config Module Import */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [appConfig, smtpConfig, databaseConfig],
    }),
    // CustomConfigModule,
    AdminModule,
    AuthModule,
    MailModule,
    JwtModule,
    ScheduleModule.forRoot(),
    // OPEN THIS WHEN YOU HAVE YOUR DATABASE CONFIGURED
    DatabaseModule,
    UserModule,
    HostModule,
    ChatModule,
    CarModule,
    BookingModule,
    CronModule,
    UploadModule,
    StripeModule,
    TermsAndConditionsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrimMiddleware).forRoutes("*");
  }
}

// This is the root module of the NestJS application.
// It imports and configures all the feature modules and global modules needed by the app,
// such as authentication, mailing, database, scheduling, and various domain modules (user, car, booking, etc.).
// The ConfigModule is set up globally to load environment variables and app-specific configs.
// The AppModule also applies global middleware (TrimMiddleware) to all routes,
// which trims whitespace from incoming request bodies to ensure clean data.
