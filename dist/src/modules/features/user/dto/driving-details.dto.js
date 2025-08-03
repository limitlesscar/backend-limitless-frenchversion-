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
exports.DrivingDetailsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../../../decorators");
const user_role_enum_1 = require("../enums/user-role.enum");
class DrivingDetailsDto {
}
exports.DrivingDetailsDto = DrivingDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "user_type",
        description: "Type of user",
        required: false,
        example: user_role_enum_1.USER_TYPE_ENUM.HOST || user_role_enum_1.USER_TYPE_ENUM.USER,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "User type cannot be empty" }),
    (0, class_validator_1.IsEnum)(user_role_enum_1.USER_TYPE_ENUM),
    __metadata("design:type", String)
], DrivingDetailsDto.prototype, "user_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "license_number",
        description: "Driving license number of the user",
        example: "1234567890",
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Driving license number is required" }),
    (0, class_validator_1.MinLength)(10, {
        message: "Driving license number should be at least 10 characters",
    }),
    (0, class_validator_1.IsString)({ message: "Driving license number should be a valid stirng" }),
    __metadata("design:type", String)
], DrivingDetailsDto.prototype, "license_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "expiry_date",
        description: "Expiry date of the driving license",
        example: "2030-01-01",
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Expiry date is required" }),
    (0, class_validator_1.IsString)({ message: "Expiry date should be a string" }),
    (0, decorators_1.IsYearMonthDayFormat)({
        message: "Expiry date should be in YYYY-MM-DD format",
    }),
    __metadata("design:type", String)
], DrivingDetailsDto.prototype, "expiry_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "license_image",
        description: "Image of the driving license",
        example: "https://example.com/license.jpg",
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "License image is required" }),
    (0, class_validator_1.IsString)({ message: "License image should be a string" }),
    (0, class_validator_1.IsUrl)({}, { message: "Enter a valid URL" }),
    __metadata("design:type", String)
], DrivingDetailsDto.prototype, "license_image", void 0);
//# sourceMappingURL=driving-details.dto.js.map