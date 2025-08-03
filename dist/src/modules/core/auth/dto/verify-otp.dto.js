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
exports.VerifyOtpDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const otp_reason_enum_1 = require("../../../features/otp/enums/otp-reason.enum");
class VerifyOtpDTO {
}
exports.VerifyOtpDTO = VerifyOtpDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Email de l’utilisateur",
        example: "usaid@zenkoders.com",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], VerifyOtpDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Code OTP",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({}, { message: "Code invalide" }),
    __metadata("design:type", Number)
], VerifyOtpDTO.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "reason",
        description: "Type de vérification",
        example: "FORGOT_PASSWORD",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(otp_reason_enum_1.OTP_REASON_ENUM),
    __metadata("design:type", String)
], VerifyOtpDTO.prototype, "reason", void 0);
//# sourceMappingURL=verify-otp.dto.js.map