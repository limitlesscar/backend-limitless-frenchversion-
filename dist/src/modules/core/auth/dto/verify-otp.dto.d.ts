import { OTP_REASON_ENUM } from "src/modules/features/otp/enums/otp-reason.enum";
export declare class VerifyOtpDTO {
    email: string;
    otp: number;
    reason: OTP_REASON_ENUM;
}
