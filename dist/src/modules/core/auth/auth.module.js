"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const user_auth_service_1 = require("./service/user-auth.service");
const user_auth_controller_1 = require("./controller/user-auth.controller");
const user_strategy_1 = require("./strategy/user.strategy");
const admin_strategy_1 = require("./strategy/admin.strategy");
const user_module_1 = require("../../features/user/user.module");
const jwt_module_1 = require("../jwt/jwt.module");
const otp_module_1 = require("../../features/otp/otp.module");
const notification_service_1 = require("../../features/notification/notification.service");
const notification_repository_1 = require("../../features/notification/repositories/notification.repository");
const notification_entity_1 = require("../../features/notification/entities/notification.entity");
const typeorm_1 = require("@nestjs/typeorm");
const admin_repository_1 = require("../../features/admin/repositories/admin.repository");
const admin_entity_1 = require("../../features/admin/entities/admin.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.NotificationEntity, admin_entity_1.AdminEntity]),
            user_module_1.UserModule,
            jwt_module_1.JwtModule,
            otp_module_1.OtpModule,
        ],
        controllers: [user_auth_controller_1.AuthController],
        providers: [
            user_strategy_1.JwtUserStrategy,
            admin_strategy_1.JwtAdminStrategy,
            user_auth_service_1.AuthService,
            notification_service_1.NotificationService,
            notification_repository_1.NotificationRepository,
            admin_repository_1.AdminRepository,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map