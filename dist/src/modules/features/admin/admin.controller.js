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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const swagger_1 = require("@nestjs/swagger");
const get_db_users_dto_1 = require("./dto/get-db-users.dto");
const login_dto_1 = require("./dto/login.dto");
const common_type_1 = require("../../../types/common.type");
const axios_1 = require("axios");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
const httpException_1 = require("../../../utils/app/httpException");
const user_entity_1 = require("../user/entities/user.entity");
const user_service_1 = require("../user/user.service");
const admin_guard_1 = require("../../core/auth/guards/admin.guard");
const reject_user_dto_1 = require("./dto/reject-user.dto");
let AdminController = class AdminController {
    constructor(adminService, userService) {
        this.adminService = adminService;
        this.userService = userService;
    }
    async login(loginDto) {
        return this.adminService.login(loginDto);
    }
    async AllUsers(getDbUsersDTO) {
        return this.adminService.UsersFromDb(getDbUsersDTO);
    }
    async getUserById(id) {
        const user = await this.userService.getUserFromDB({
            where: { id },
            relations: { host: true },
        });
        if (!user) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.USER_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        delete user.password;
        return user;
    }
    async rejectUser(rejectUserDto) {
        return await this.adminService.rejectUser(rejectUserDto);
    }
    async approveUser(id) {
        return await this.adminService.approveUser(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)("/login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.AdminLoginDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("users"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_db_users_dto_1.GetDbUsersDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "AllUsers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get user by id" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "User Retrieved Successfully",
        type: user_entity_1.UserEntity,
    }),
    (0, common_1.UseGuards)(admin_guard_1.JwtAdminGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("user/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Reject user" }),
    (0, common_1.UseGuards)(admin_guard_1.JwtAdminGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Post)("reject-user"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reject_user_dto_1.RejectUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Approve User" }),
    (0, common_1.UseGuards)(admin_guard_1.JwtAdminGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Post)("approve-user/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveUser", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, swagger_1.ApiTags)("Admin-Panel"),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        user_service_1.UserService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map