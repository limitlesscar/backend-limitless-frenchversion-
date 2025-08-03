"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/core/auth/auth.module");
const mail_module_1 = require("./modules/core/mail/mail.module");
const jwt_module_1 = require("./modules/core/jwt/jwt.module");
const database_module_1 = require("./modules/database/database.module");
const config_1 = require("@nestjs/config");
const app_config_1 = require("./config/loaders/app.config");
const smtp_config_1 = require("./config/loaders/smtp.config");
const database_config_1 = require("./config/loaders/database.config");
const trim_body_middleware_1 = require("./middlewares/trim-body.middleware");
const user_module_1 = require("./modules/features/user/user.module");
const car_module_1 = require("./modules/features/car/car.module");
const booking_module_1 = require("./modules/features/booking/booking.module");
const host_module_1 = require("./modules/features/host/host.module");
const upload_module_1 = require("./modules/features/upload/upload.module");
const chat_module_1 = require("./modules/features/chat/chat.module");
const schedule_1 = require("@nestjs/schedule");
const cron_module_1 = require("./modules/features/cron/cron.module");
const stripe_module_1 = require("./modules/stripe/stripe.module");
const terms_and_conditions_module_1 = require("./modules/features/terms_and_conditions/terms_and_conditions.module");
const admin_module_1 = require("./modules/features/admin/admin.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(trim_body_middleware_1.TrimMiddleware).forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
                load: [app_config_1.default, smtp_config_1.default, database_config_1.default],
            }),
            admin_module_1.AdminModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            jwt_module_1.JwtModule,
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            host_module_1.HostModule,
            chat_module_1.ChatModule,
            car_module_1.CarModule,
            booking_module_1.BookingModule,
            cron_module_1.CronModule,
            upload_module_1.UploadModule,
            stripe_module_1.StripeModule,
            terms_and_conditions_module_1.TermsAndConditionsModule,
        ],
        controllers: [],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map