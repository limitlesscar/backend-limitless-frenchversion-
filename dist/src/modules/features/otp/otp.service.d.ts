import { HttpStatus } from "@nestjs/common";
import { OTPTableEntity } from "./entity/otp.entity";
import { UserService } from "../user/user.service";
import { OtpRepository } from "./repositories/otp.repository";
import { OTP_REASON_ENUM } from "./enums/otp-reason.enum";
import { HttpStatusCode } from "axios";
export declare class OtpService {
    private readonly otpRepository;
    private readonly userService;
    constructor(otpRepository: OtpRepository, userService: UserService);
    generateOTPCode({ email, reason, }: {
        email: string;
        reason: OTP_REASON_ENUM;
    }): Promise<number>;
    create(data: Partial<OTPTableEntity>): Promise<OTPTableEntity>;
    verifyOTPCode({ otp, email, reason, }: {
        otp: number;
        email: string;
        reason: OTP_REASON_ENUM;
    }): Promise<{
        status: HttpStatus;
        statusCode: HttpStatusCode;
        message: string;
    }>;
}
