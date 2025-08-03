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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_auth_service_1 = require("../service/user-auth.service");
const login_dto_1 = require("../dto/login.dto");
const response_1 = require("../response");
const error_schema_1 = require("../../../../utils/app/error-schema");
const admin_login_dto_1 = require("../dto/admin-login.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login({ email, password }) {
        return await this.authService.login({
            email,
            password,
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Connexion d’un utilisateur" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "L’utilisateur s’est connecté avec succès.",
        type: response_1.UserLogin,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "Échec de la validation.",
        schema: (0, error_schema_1.errorSchema)(common_1.HttpStatus.BAD_REQUEST),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: "OTP invalide.",
        schema: (0, error_schema_1.errorSchema)(common_1.HttpStatus.UNAUTHORIZED),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: "Utilisateur non trouvé.",
        schema: (0, error_schema_1.errorSchema)(common_1.HttpStatus.NOT_FOUND),
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDTO }),
    (0, common_1.Post)("/login"),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Admin Auth"),
    (0, common_1.Controller)("/admin/auth"),
    __metadata("design:paramtypes", [user_auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=admin-auth.controller.js.map