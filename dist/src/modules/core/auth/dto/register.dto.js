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
exports.RegisterDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const password_match_decorator_1 = require("../../../../decorators/password-match.decorator");
const user_role_enum_1 = require("../../../features/user/enums/user-role.enum");
class RegisterDTO {
}
exports.RegisterDTO = RegisterDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "first_name",
        description: "First name of the user",
        example: "Usaid",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: "First Name should atleast contain 3 characters" }),
    (0, class_validator_1.MaxLength)(20, { message: "First Name should not exceed 20 characters" }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "last_name",
        description: "Last name of the user",
        example: "Asif",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3, { message: "Last Name should atleast contain 3 alphabets" }),
    (0, class_validator_1.MaxLength)(20, { message: "Last Name should not exceed 20 characters" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Email of the user",
        example: "usaid@zenkoders.com",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)({}, { message: "Enter a valid email address" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Password of the user",
        example: "Password1!",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Password should not be empty." }),
    (0, class_validator_1.IsString)({ message: "Password must be a string." }),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
    }),
    (0, class_validator_1.Matches)(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    }),
    (0, class_validator_1.Matches)(/\d/, { message: "Password must contain at least one number." }),
    (0, class_validator_1.Matches)(/[@$!%*?&#+,"./:;()_=\-`{}|<>~^]/, {
        message: "Password must contain at least one special character.",
    }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Password of the user",
        example: "Password1!",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Password should not be empty." }),
    (0, class_validator_1.IsString)({ message: "Password must be a string." }),
    (0, password_match_decorator_1.PasswordMatch)("password", { message: "Passwords does not match." }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "confirmPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "phone_number",
        description: "Phone Number of the user",
        example: "+923182516827",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Phone Number should not be empty." }),
    (0, class_validator_1.IsString)({ message: "Phone Number must be a string." }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "phone_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "user_type",
        description: "Type of the user",
        example: "user or host",
        enum: [user_role_enum_1.USER_TYPE_ENUM.HOST, user_role_enum_1.USER_TYPE_ENUM.USER],
    }),
    (0, class_validator_1.IsEnum)(user_role_enum_1.USER_TYPE_ENUM),
    (0, class_validator_1.IsNotEmpty)({ message: "User Type should not be empty." }),
    __metadata("design:type", String)
], RegisterDTO.prototype, "user_type", void 0);
//# sourceMappingURL=register.dto.js.map