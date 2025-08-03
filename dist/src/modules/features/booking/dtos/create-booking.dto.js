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
exports.BookCarWithPaymentDto = exports.BookCarDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class BookCarDto {
}
exports.BookCarDto = BookCarDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "car_id",
        description: "Id of the car you want to book",
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Car Id cannot be empty" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BookCarDto.prototype, "car_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "start_date_time",
        description: "Start date time of the booking",
        example: "2024-12-25T12:00:00Z",
        required: false,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Start Date Time cannot be empty" }),
    (0, class_validator_1.IsString)({ message: "Start date time should be a valid string" }),
    __metadata("design:type", String)
], BookCarDto.prototype, "start_date_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "end_date_time",
        description: "End date time of the booking",
        example: "2024-12-25T12:00:00Z",
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: "End date time should be a valid string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "End Date Time cannot be empty" }),
    __metadata("design:type", String)
], BookCarDto.prototype, "end_date_time", void 0);
class BookCarWithPaymentDto {
}
exports.BookCarWithPaymentDto = BookCarWithPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "car_id",
        description: "Id of the car you want to book",
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Car Id cannot be empty" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BookCarWithPaymentDto.prototype, "car_id", void 0);
//# sourceMappingURL=create-booking.dto.js.map