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
exports.UserEditProfileDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../../../decorators");
const register_dto_1 = require("../../../core/auth/dto/register.dto");
class UserEditProfileDTO extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(register_dto_1.RegisterDTO, ["email", "password", "confirmPassword", "user_type"])) {
}
exports.UserEditProfileDTO = UserEditProfileDTO;
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
], UserEditProfileDTO.prototype, "profile_picture", void 0);
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
], UserEditProfileDTO.prototype, "date_of_birth", void 0);
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
], UserEditProfileDTO.prototype, "emergency_contact", void 0);
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
], UserEditProfileDTO.prototype, "country", void 0);
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
], UserEditProfileDTO.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "address",
        description: "Address of the user",
        example: "Ghulam Ishaq Khan Hall, University of Karachi",
        required: false,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Address is required " }),
    __metadata("design:type", String)
], UserEditProfileDTO.prototype, "address", void 0);
//# sourceMappingURL=edit-profile.dto.js.map