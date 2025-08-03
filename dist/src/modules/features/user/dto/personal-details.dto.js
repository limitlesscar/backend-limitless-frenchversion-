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
exports.PersonalDetailsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_role_enum_1 = require("../enums/user-role.enum");
const decorators_1 = require("../../../../decorators");
class PersonalDetailsDto {
}
exports.PersonalDetailsDto = PersonalDetailsDto;
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
], PersonalDetailsDto.prototype, "user_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "profile_picture",
        description: "Profile picture of the user",
        example: "https://example.com/profile.jpg",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({}, { message: "Enter a valid URL" }),
    __metadata("design:type", String)
], PersonalDetailsDto.prototype, "profile_picture", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "date_of_birth",
        description: "Date of birth of the user",
        example: "2000-01-01",
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Date of birth is required" }),
    (0, class_validator_1.IsString)({ message: "Date of birth should be a string" }),
    (0, decorators_1.IsYearMonthDayFormat)({
        message: "Date of birth should be in YYYY-MM-DD format",
    }),
    __metadata("design:type", String)
], PersonalDetailsDto.prototype, "date_of_birth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "emergency_contact",
        description: "Emergency contact of the user",
        example: "+923001234567",
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: "Emergency contact should be a string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PersonalDetailsDto.prototype, "emergency_contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "id_card_front",
        description: "Front side of the ID card",
        example: "https://example.com/id_card_front.jpg",
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "ID card front is required" }),
    (0, class_validator_1.IsString)({ message: "ID card front should be a string" }),
    (0, class_validator_1.IsUrl)({}, { message: "Enter a valid URL" }),
    __metadata("design:type", String)
], PersonalDetailsDto.prototype, "id_card_front", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "id_card_back",
        description: "Back side of the ID card",
        example: "https://example.com/id_card_back.jpg",
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "ID card back is required" }),
    (0, class_validator_1.IsString)({ message: "ID card back should be a string" }),
    (0, class_validator_1.IsUrl)({}, { message: "Enter a valid URL" }),
    __metadata("design:type", String)
], PersonalDetailsDto.prototype, "id_card_back", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "country",
        description: "Country of the user",
        example: "Pakistan",
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: "Country should be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Country is required " }),
    __metadata("design:type", String)
], PersonalDetailsDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "city",
        description: "City of the user",
        example: "Karachi",
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: "City should be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "City is required " }),
    __metadata("design:type", String)
], PersonalDetailsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "address",
        description: "Address of the user",
        example: "Ghulam Ishaq Khan Hall, University of Karachi",
        required: false,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Address is required " }),
    __metadata("design:type", String)
], PersonalDetailsDto.prototype, "address", void 0);
//# sourceMappingURL=personal-details.dto.js.map