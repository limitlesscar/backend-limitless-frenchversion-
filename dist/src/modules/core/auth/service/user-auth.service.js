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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("../../../features/otp/otp.service");
const user_service_1 = require("../../../features/user/user.service");
const jwt_user_service_1 = require("../../jwt/services/jwt-user.service");
const httpException_1 = require("../../../../utils/app/httpException");
const bcrypt_1 = require("../../../../utils/hashing/bcrypt");
const otp_reason_enum_1 = require("../../../features/otp/enums/otp-reason.enum");
const forget_password_1 = require("../../mail/template/forget-password");
const mail_service_1 = require("../../mail/mail.service");
const axios_1 = require("axios");
const error_messages_enum_1 = require("../../../../types/enums/user/error-messages.enum");
const notification_service_1 = require("../../../features/notification/notification.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, otpService, mailService, notificationService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.mailService = mailService;
        this.notificationService = notificationService;
    }
    async login({ email, password, }) {
        email = email.toLowerCase();
        const user = await this.userService.getUserFromDB({
            where: { email },
            relations: { host: true },
        });
        if (!user) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.USER_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        const passwordMatched = (0, bcrypt_1.comparePassword)(password, user.password);
        if (!passwordMatched) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_CREDENTIALS], axios_1.HttpStatusCode.Unauthorized, common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = this.jwtService.generateJWT(user);
        delete user.password;
        return { user, token };
    }
    async requestOTP({ email, reason, }) {
        const user = await this.userService.getUserFromDB({ where: { email } });
        if (!user) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.USER_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        if (reason !== otp_reason_enum_1.OTP_REASON_ENUM.FORGOT_PASSWORD) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_OTP_REASON], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const code = await this.otpService.generateOTPCode({
            email,
            reason,
        });
        const mailOptions = {
            to: email,
            subject: "Vérification OTP Go Limitless",
            html: (0, forget_password_1.forgotPasswordOtpTemplate)(code),
        };
        await this.mailService.sendMail({ mailOptions: mailOptions });
        return {
            message: "Le code OTP a été envoyé à votre email",
        };
    }
    async verifyOtp({ email, otp, reason, }) {
        const user = await this.userService.getUserFromDB({ where: { email } });
        if (!user) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.USER_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        const { statusCode } = await this.otpService.verifyOTPCode({
            otp,
            email,
            reason,
        });
        if (reason === otp_reason_enum_1.OTP_REASON_ENUM.FORGOT_PASSWORD &&
            statusCode === axios_1.HttpStatusCode.Ok) {
            const token = this.jwtService.generateJWT({
                id: user.id,
                email: user.email,
            });
            return {
                user,
                token,
                message: "Le code OTP a été vérifié.",
            };
        }
    }
    async resetPassword({ email, otp, password, }) {
        const user = await this.userService.getUserFromDB({ where: { email } });
        if (!user) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.USER_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        const isSamePassword = (0, bcrypt_1.comparePassword)(password, user.password);
        if (isSamePassword) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_PASSWORD], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const { status } = await this.otpService.verifyOTPCode({
            email,
            otp,
            reason: otp_reason_enum_1.OTP_REASON_ENUM.FORGOT_PASSWORD,
        });
        if (status !== common_1.HttpStatus.OK) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CANNOT_RESET_PASSWORD_AT_THIS_MOMENT], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = (0, bcrypt_1.hashPassword)(password);
        await this.userService.updateUser({
            where: { email },
            data: { password: hashedPassword },
        });
        return {
            message: "Le mot de passe a été réinitialisé avec succès.",
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_user_service_1.JwtUserService,
        otp_service_1.OtpService,
        mail_service_1.MailService,
        notification_service_1.NotificationService])
], AuthService);
//# sourceMappingURL=user-auth.service.js.map