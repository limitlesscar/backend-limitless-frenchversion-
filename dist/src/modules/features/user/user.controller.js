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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_schema_1 = require("../../../utils/app/error-schema");
const user_entity_1 = require("./entities/user.entity");
const user_service_1 = require("./user.service");
const common_type_1 = require("../../../types/common.type");
const user_guard_1 = require("../../core/auth/guards/user.guard");
const personal_details_dto_1 = require("./dto/personal-details.dto");
const driving_details_dto_1 = require("./dto/driving-details.dto");
const set_location_dto_1 = require("./dto/set-location.dto");
const logout_dto_1 = require("./dto/logout.dto");
const edit_profile_dto_1 = require("./dto/edit-profile.dto");
const edit_driving_details_dto_1 = require("./dto/edit-driving-details.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const httpException_1 = require("../../../utils/app/httpException");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
const axios_1 = require("axios");
const register_dto_1 = require("../../core/auth/dto/register.dto");
const response_1 = require("../../core/auth/response");
const my_orders_dto_1 = require("./dto/my-orders.dto");
const add_fcm_token_dto_1 = require("./dto/add-fcm-token.dto");
const notification_preference_1 = require("./dto/notification-preference");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async whoAmI({ user }) {
        return user;
    }
    async myOrders({ user }, ordersDto) {
        return await this.userService.myOrders(user, ordersDto);
    }
    async OrdersForMyCars({ user }, ordersDto) {
        return await this.userService.ordersForMyCars(user, ordersDto);
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
    async register(registerDto) {
        return await this.userService.register(registerDto);
    }
    async addFcmToken({ fcmToken }, { user }) {
        return await this.userService.addFcmToken(fcmToken, user.id);
    }
    async setPersonalDetails({ user }, personalDetailsDto) {
        return await this.userService.setPersonalDetails(user, personalDetailsDto);
    }
    async setDrivingDetails({ user }, drivingDetailsDto) {
        return await this.userService.setDrivingDetails(drivingDetailsDto, user);
    }
    async Logout(logoutDto) {
        return await this.userService.logout(logoutDto);
    }
    async setNotificationPreference(setNotificationPreference, { user }) {
        return await this.userService.updateUserNotificationPreference(user, setNotificationPreference);
    }
    async updateUserProfile({ user }, userEditProfileDTO) {
        return await this.userService.editUserProfile(user, userEditProfileDTO);
    }
    async updateDrivingDetails({ user }, editDrivingDetailsDto) {
        return await this.userService.editDrivingDetails(user, editDrivingDetailsDto);
    }
    async setUserLocation({ user }, locationDto) {
        return await this.userService.setLocation(user, locationDto);
    }
    async changePassword({ user }, changePasswordDto) {
        return await this.userService.changePassword(user, changePasswordDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get user by jwt token" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "whoAmI", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get my orders" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("orders"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, my_orders_dto_1.OrdersDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "myOrders", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get orders for my cars" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("orders/mycars"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, my_orders_dto_1.OrdersDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "OrdersForMyCars", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get user by id" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "User Retrieved Successfully",
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Register a user aka onboarding" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "User has been successfully registered.",
        type: response_1.UserLogin,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "Validation failed.",
        schema: (0, error_schema_1.errorSchema)(common_1.HttpStatus.BAD_REQUEST),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: "User not found.",
        schema: (0, error_schema_1.errorSchema)(common_1.HttpStatus.NOT_FOUND),
    }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDTO }),
    (0, common_1.Post)(""),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Add fcm token" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Post)("/fcm-token"),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_fcm_token_dto_1.AddFcmTokenDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFcmToken", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Set user personal details" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Post)("personal-details"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, personal_details_dto_1.PersonalDetailsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setPersonalDetails", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Set user driving details" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Post)("driving-details"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, driving_details_dto_1.DrivingDetailsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setDrivingDetails", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Logout a user" }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logout_dto_1.LogoutDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Logout", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Set notification preference" }),
    (0, common_1.Post)("/preference"),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_preference_1.SetNotificationPreference, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setNotificationPreference", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Update user profile" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Patch)("personal-details"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_profile_dto_1.UserEditProfileDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Update user driving details" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Patch)("driving-details"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_driving_details_dto_1.EditDrivingDetailsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateDrivingDetails", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Set user location" }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Patch)("location"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, set_location_dto_1.LocationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setUserLocation", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiOperation)({ summary: "Change user password" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Patch)("change-password"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("user"),
    (0, swagger_1.ApiTags)("User"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map