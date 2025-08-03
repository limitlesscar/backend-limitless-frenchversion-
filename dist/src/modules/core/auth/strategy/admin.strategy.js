"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAdminStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const axios_1 = require("axios");
const passport_jwt_1 = require("passport-jwt");
const admin_repository_1 = require("../../../features/admin/repositories/admin.repository");
const error_messages_enum_1 = require("../../../../types/enums/user/error-messages.enum");
const httpException_1 = require("../../../../utils/app/httpException");
let JwtAdminStrategy = class JwtAdminStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "jwt_admin") {
    constructor(configService, adminRepository) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow("app.adminSecret"),
            ignoreExpiration: false,
        });
        this.adminRepository = adminRepository;
    }
    async validate({ id }) {
        try {
            const admin = await this.adminRepository.findOne({
                where: { id },
            });
            if (!admin) {
                common_1.Logger.error("Invalid token");
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_TOKEN], axios_1.HttpStatusCode.Unauthorized, common_1.HttpStatus.UNAUTHORIZED);
            }
            delete admin.password;
            return admin;
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                common_1.Logger.error("Token expired");
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.EXPIRED_TOKEN], axios_1.HttpStatusCode.Unauthorized, common_1.HttpStatus.UNAUTHORIZED);
            }
            else {
                (0, httpException_1.throwHttpException)(["Unauthorized"], axios_1.HttpStatusCode.Unauthorized, common_1.HttpStatus.UNAUTHORIZED);
            }
        }
    }
};
exports.JwtAdminStrategy = JwtAdminStrategy;
exports.JwtAdminStrategy = JwtAdminStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, admin_repository_1.AdminRepository])
], JwtAdminStrategy);
//# sourceMappingURL=admin.strategy.js.map