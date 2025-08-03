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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUserService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let JwtUserService = class JwtUserService {
    constructor(configService, jwtService) {
        this.configService = configService;
        this.jwtService = jwtService;
    }
    generateAuthToken({ payload }) {
        const jwt = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow("app.userSecret"),
            expiresIn: this.configService.getOrThrow("app.userExpiresIn"),
        });
        return jwt;
    }
    async decodeAuthToken({ token }) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get("app.userSecret"),
            });
        }
        catch (error) {
            common_1.Logger.error("🚀 Decode Auth Token Error", error);
            throw new common_1.UnauthorizedException("Invalid token");
        }
    }
    generateJWT(user) {
        const payload = {
            id: user.id,
            email: user.email,
        };
        common_1.Logger.log("[User Auth Service][generateJWT]: ", this.generateAuthToken({ payload }));
        return this.generateAuthToken({ payload });
    }
};
exports.JwtUserService = JwtUserService;
exports.JwtUserService = JwtUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], JwtUserService);
//# sourceMappingURL=jwt-user.service.js.map