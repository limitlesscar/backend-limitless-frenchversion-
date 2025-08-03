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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_dto_1 = require("../../../../types/pagination/common.dto");
const booking_status_enum_1 = require("../../booking/enums/booking-status.enum");
const class_validator_1 = require("class-validator");
class OrdersDto extends common_dto_1.PaginationDto {
}
exports.OrdersDto = OrdersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "status",
        enum: [
            booking_status_enum_1.BookingStatus.UPCOMING,
            booking_status_enum_1.BookingStatus.ONGOING,
            booking_status_enum_1.BookingStatus.COMPLETED,
        ],
    }),
    (0, class_validator_1.IsEnum)(booking_status_enum_1.BookingStatus),
    (0, class_validator_1.IsNotEmpty)({ message: "Booking status cannot be empty" }),
    __metadata("design:type", String)
], OrdersDto.prototype, "status", void 0);
//# sourceMappingURL=my-orders.dto.js.map