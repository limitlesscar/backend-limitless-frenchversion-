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
exports.ChangePasswordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const password_match_decorator_1 = require("../../../../decorators/password-match.decorator");
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Old password of the user",
        example: "OldPassword123!",
    }),
    (0, class_validator_1.IsString)({ message: "Old password must be a string." }),
    (0, class_validator_1.IsNotEmpty)({ message: "Old password should not be empty." }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "old_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "New password, must meet all validation requirements (8-20 characters, uppercase, lowercase, number, special character)",
        example: "NewPassword123!",
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
    (0, class_validator_1.Matches)(/[@$!%*?&]/, {
        message: "Password must contain at least one special character.",
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "new_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Confirmation of the new password, must match the new password exactly",
        example: "NewPassword123!",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Password should not be empty." }),
    (0, class_validator_1.IsString)({ message: "Password must be a string." }),
    (0, password_match_decorator_1.PasswordMatch)("new_password", { message: "Passwords does not match." }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "confirm_password", void 0);
//# sourceMappingURL=change-password.dto.js.map