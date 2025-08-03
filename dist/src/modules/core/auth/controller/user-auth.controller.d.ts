import { AuthService } from "../service/user-auth.service";
import { LoginDTO } from "../dto/login.dto";
import { ForgotPasswordDTO } from "../dto/forgot-password.dto";
import { RequestOTPDTO } from "../dto/request-otp.dto";
import { UserEntity } from "src/modules/features/user/entities/user.entity";
import { VerifyOtpDTO } from "../dto/verify-otp.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login({ email, password }: LoginDTO): Promise<{
        user: UserEntity;
        token: string;
    }>;
    requestOTP({ email, reason }: RequestOTPDTO): Promise<{
        message: string;
    }>;
    verifyOtp({ email, otp, reason }: VerifyOtpDTO): Promise<{
        user: UserEntity;
        token: string;
        message: string;
    }>;
    resetPassword({ email, password, otp }: ForgotPasswordDTO): Promise<{
        message: string;
    }>;
}
