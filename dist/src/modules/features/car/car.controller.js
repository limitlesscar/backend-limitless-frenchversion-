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
exports.CarController = void 0;
const common_1 = require("@nestjs/common");
const car_service_1 = require("./car.service");
const swagger_1 = require("@nestjs/swagger");
const register_car_dto_1 = require("./dto/register-car.dto");
const user_guard_1 = require("../../core/auth/guards/user.guard");
const role_guard_1 = require("../../core/auth/guards/role.guard");
const role_decorator_1 = require("../../../decorators/role.decorator");
const user_role_enum_1 = require("../user/enums/user-role.enum");
const common_type_1 = require("../../../types/common.type");
const edit_car_dto_1 = require("./dto/edit-car.dto");
const common_dto_1 = require("../../../types/pagination/common.dto");
const filter_car_dto_1 = require("./dto/filter-car.dto");
const booking_service_1 = require("../booking/booking.service");
const logged_in_userid_dto_1 = require("./dto/logged-in-userid.dto");
const car_status_enum_1 = require("./enums/car-status.enum");
let CarController = class CarController {
    constructor(carService, bookingService) {
        this.carService = carService;
        this.bookingService = bookingService;
    }
    async getMyCars({ user: { host } }, paginationDto) {
        return await this.carService.listMyCars(host, paginationDto);
    }
    async filterCars(filterCarDto, authHeader) {
        const token = authHeader?.split(" ")[1];
        return await this.carService.filterCars(filterCarDto, token);
    }
    async listAllCarBookings(id) {
        return await this.bookingService.getAllValidBookingsOfCar(id);
    }
    async getCarsForMap(authHeader) {
        const token = authHeader?.split(" ")[1];
        return await this.carService.getCarsCordinates(token);
    }
    async getCarById(id, { chat_type }, authHeader) {
        const token = authHeader?.split(" ")[1];
        return await this.carService.getCarDetails(id, chat_type, token);
    }
    async getCarByIdforMap(id) {
        return await this.carService.getCarByIdForMap(id);
    }
    Register(registerCarDto, { user }) {
        return this.carService.register(registerCarDto, user);
    }
    updateCarDetails(editCarDto, id, { user: { host } }) {
        return this.carService.EditCarDetails(id, editCarDto, host);
    }
    async unpublishCar(id, status, { user: { host } }) {
        const res = await this.carService.UpdateCarStatus(id, host, status);
        return res;
    }
};
exports.CarController = CarController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.HOST),
    (0, swagger_1.ApiOperation)({ summary: "Get Logged In Host Cars" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("/host"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, common_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "getMyCars", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Filter cars" }),
    (0, swagger_1.ApiHeaders)([{ name: "authorization", required: false }]),
    (0, common_1.Get)("/filter"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_car_dto_1.FilterCarDto, String]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "filterCars", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "List all booking dates of a car" }),
    (0, swagger_1.ApiHeaders)([{ name: "authorization", required: false }]),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("/:id/bookings"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "listAllCarBookings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "List all cars with coordinates for map" }),
    (0, common_1.Get)("/map"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "getCarsForMap", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get Car By Id" }),
    (0, swagger_1.ApiHeaders)([{ name: "authorization", required: false }]),
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, logged_in_userid_dto_1.ChatTypeDto, String]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "getCarById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get Car By Id For Map" }),
    (0, common_1.Get)("/map/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "getCarByIdforMap", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.HOST),
    (0, swagger_1.ApiOperation)({ summary: "Register Car" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_car_dto_1.RegisterCarDto, Object]),
    __metadata("design:returntype", void 0)
], CarController.prototype, "Register", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.HOST),
    (0, swagger_1.ApiOperation)({ summary: "Edit Car Details" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Car Id", type: "number" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Patch)("/:id"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [edit_car_dto_1.EditCarDto, Number, Object]),
    __metadata("design:returntype", void 0)
], CarController.prototype, "updateCarDetails", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.HOST),
    (0, swagger_1.ApiOperation)({ summary: "Unpublish a car" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Car Id", type: "number" }),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Patch)("/unpublish/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], CarController.prototype, "unpublishCar", null);
exports.CarController = CarController = __decorate([
    (0, common_1.Controller)("car"),
    (0, swagger_1.ApiTags)("Car"),
    __metadata("design:paramtypes", [car_service_1.CarService,
        booking_service_1.BookingService])
], CarController);
//# sourceMappingURL=car.controller.js.map