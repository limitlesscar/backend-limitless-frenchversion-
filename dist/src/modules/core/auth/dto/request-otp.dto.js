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
exports.RequestOTPDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const otp_reason_enum_1 = require("../../../features/otp/enums/otp-reason.enum");
class RequestOTPDTO {
}
exports.RequestOTPDTO = RequestOTPDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Email of the user",
        example: "usaid@zenkoders.com",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RequestOTPDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "reason to request OTP",
        example: "FORGOT_PASSWORD",
        enum: otp_reason_enum_1.OTP_REASON_ENUM,
    }),
    (0, class_validator_1.IsEnum)(otp_reason_enum_1.OTP_REASON_ENUM),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestOTPDTO.prototype, "reason", void 0);
//# sourceMappingURL=request-otp.dto.js.map