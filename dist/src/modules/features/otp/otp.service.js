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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const otp_1 = require("../../../utils/app/otp");
const otp_repository_1 = require("./repositories/otp.repository");
const otp_reason_enum_1 = require("./enums/otp-reason.enum");
const axios_1 = require("axios");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
const httpException_1 = require("../../../utils/app/httpException");
let OtpService = class OtpService {
    constructor(otpRepository, userService) {
        this.otpRepository = otpRepository;
        this.userService = userService;
    }
    async generateOTPCode({ email, reason, }) {
        const user = await this.userService.getUserFromDB({ where: { email } });
        if (!user) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.USER_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        const otp_requested_by_user = await this.otpRepository.find({
            where: { user: { id: user.id }, type: reason },
        });
        await this.otpRepository.remove(otp_requested_by_user);
        const code = (0, otp_1.generateOTP)({
            length: 4,
            options: otp_1.NUMERICAL_OTP,
        });
        await this.create({
            email,
            otp: code,
            is_used: false,
            is_expired: false,
            type: reason,
            user: { id: user.id },
        });
        return code;
    }
    async create(data) {
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 1);
        data.expires_at = expiry;
        return this.otpRepository.save(data);
    }
    async verifyOTPCode({ otp, email, reason, }) {
        const otp_record = await this.otpRepository.findOne({
            where: { otp, email },
        });
        if (!otp_record) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_OTP], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        if (otp_record.is_expired) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_OTP], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (otp_record.is_used && reason !== otp_reason_enum_1.OTP_REASON_ENUM.FORGOT_PASSWORD) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.OTP_ALREADY_USED], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const currentTime = new Date().getTime();
        const expiry_date = new Date(otp_record.expires_at).getTime();
        if (expiry_date < currentTime) {
            this.otpRepository.update({ email, otp }, { is_expired: true, is_used: true });
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_OTP], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        this.otpRepository.update({ email, otp }, { is_used: true });
        return {
            status: common_1.HttpStatus.OK,
            statusCode: axios_1.HttpStatusCode.Ok,
            message: "OTP code is valid",
        };
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [otp_repository_1.OtpRepository,
        user_service_1.UserService])
], OtpService);
//# sourceMappingURL=otp.service.js.map