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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const swagger_1 = require("@nestjs/swagger");
const role_guard_1 = require("../../core/auth/guards/role.guard");
const user_guard_1 = require("../../core/auth/guards/user.guard");
const user_role_enum_1 = require("../user/enums/user-role.enum");
const role_decorator_1 = require("../../../decorators/role.decorator");
const common_type_1 = require("../../../types/common.type");
const create_booking_dto_1 = require("./dtos/create-booking.dto");
const cancel_booking_dto_1 = require("./dtos/cancel-booking.dto");
const add_review_dto_1 = require("./dtos/add-review.dto");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async GetBookingById(id, { user }) {
        return await this.bookingService.getCarBookingDetails(id, user.id);
    }
    async GetBookingByIdea(id, { user }) {
        return await this.bookingService.getCarBookingDetailsForUser(id, user.id);
    }
    async validateBooking(bookCarDto, { user }) {
        return await this.bookingService.BookCar(bookCarDto, user);
    }
    async AddReviewToBooking(addReviewDto, { user }) {
        return await this.bookingService.addReview(user, addReviewDto);
    }
    async CancelBooking(cancelBookingDto, id, { user }) {
        return await this.bookingService.cancelBooking(id, cancelBookingDto, user.id);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.HOST),
    (0, swagger_1.ApiOperation)({ summary: "Get booking by id for host view" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "GetBookingById", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.USER),
    (0, swagger_1.ApiOperation)({ summary: "Get booking by id for user view" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("/user/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "GetBookingByIdea", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.USER),
    (0, swagger_1.ApiOperation)({ summary: "Book a car" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.BookCarDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "validateBooking", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.USER),
    (0, swagger_1.ApiOperation)({ summary: "Add a review to booking" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Post)("review"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_review_dto_1.AddReviewDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "AddReviewToBooking", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.USER),
    (0, swagger_1.ApiOperation)({ summary: "Cancel a booking" }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Patch)("/cancel/:id"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cancel_booking_dto_1.CancelBookingDto, Number, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "CancelBooking", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)("booking"),
    (0, swagger_1.ApiTags)("Booking"),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map