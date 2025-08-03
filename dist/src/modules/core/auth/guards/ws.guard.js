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
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("axios");
const error_messages_enum_1 = require("../../../../types/enums/user/error-messages.enum");
const httpException_1 = require("../../../../utils/app/httpException");
let WsJwtGuard = class WsJwtGuard {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    canActivate(context) {
        if (context.getType() !== "ws") {
            true;
        }
        const client = context.switchToWs().getClient();
        const { authorization } = client.handshake.headers;
        this.validateToken(client);
        return false;
    }
    async validateToken(client) {
        const { authorization } = client.handshake.headers;
        if (!authorization) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.UNAUTHORIZED_ACCESS], axios_1.HttpStatusCode.Unauthorized, common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = authorization.split(" ")[1];
        const payload = await this.jwtService.decode(token);
        return payload;
    }
};
exports.WsJwtGuard = WsJwtGuard;
exports.WsJwtGuard = WsJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], WsJwtGuard);
//# sourceMappingURL=ws.guard.js.map