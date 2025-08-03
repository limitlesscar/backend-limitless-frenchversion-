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
exports.ForgotPasswordDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const password_match_decorator_1 = require("../../../../decorators/password-match.decorator");
class ForgotPasswordDTO {
}
exports.ForgotPasswordDTO = ForgotPasswordDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Email de l'utilisateur",
        example: "usaid@zenkoders.com",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Code OTP",
        example: 1234,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ForgotPasswordDTO.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Nouveau mot de passe de l'utilisateur",
        example: "newPassword1!",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le mot de passe ne doit pas être vide." }),
    (0, class_validator_1.IsString)({ message: "Le mot de passe doit être une chaîne de caractères." }),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/[a-z]/, {
        message: "Le mot de passe doit contenir au moins une lettre minuscule.",
    }),
    (0, class_validator_1.Matches)(/[A-Z]/, {
        message: "Le mot de passe doit contenir au moins une lettre majuscule.",
    }),
    (0, class_validator_1.Matches)(/\d/, {
        message: "Le mot de passe doit contenir au moins un chiffre.",
    }),
    (0, class_validator_1.Matches)(/[@$!%*?&#+,"./:;()_=\-`{}|<>~^]/, {
        message: "Le mot de passe doit contenir au moins un caractère spécial.",
    }),
    __metadata("design:type", String)
], ForgotPasswordDTO.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Confirmation du nouveau mot de passe de l'utilisateur",
        example: "Password1!",
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "La confirmation du mot de passe ne doit pas être vide.",
    }),
    (0, class_validator_1.IsString)({
        message: "La confirmation du mot de passe doit être une chaîne de caractères.",
    }),
    (0, password_match_decorator_1.PasswordMatch)("password", {
        message: "Les mots de passe ne correspondent pas.",
    }),
    __metadata("design:type", String)
], ForgotPasswordDTO.prototype, "confirmPassword", void 0);
//# sourceMappingURL=forgot-password.dto.js.map