import { UserEntity } from "src/modules/features/user/entities/user.entity";
import { OtpService } from "src/modules/features/otp/otp.service";
import { UserService } from "src/modules/features/user/user.service";
import { JwtUserService } from "../../jwt/services/jwt-user.service";
import { OTP_REASON_ENUM } from "src/modules/features/otp/enums/otp-reason.enum";
import { MailService } from "../../mail/mail.service";
import { NotificationService } from "src/modules/features/notification/notification.service";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly otpService;
    private readonly mailService;
    private readonly notificationService;
    constructor(userService: UserService, jwtService: JwtUserService, otpService: OtpService, mailService: MailService, notificationService: NotificationService);
    login({ email, password, }: {
        email: string;
        password: string;
    }): Promise<{
        user: UserEntity;
        token: string;
    }>;
    requestOTP({ email, reason, }: {
        email: string;
        reason: OTP_REASON_ENUM;
    }): Promise<{
        message: string;
    }>;
    verifyOtp({ email, otp, reason, }: {
        email: string;
        otp: number;
        reason: OTP_REASON_ENUM;
    }): Promise<{
        user: UserEntity;
        token: string;
        message: string;
    }>;
    resetPassword({ email, otp, password, }: {
        email: string;
        otp: number;
        password: string;
    }): Promise<{
        message: string;
    }>;
}
