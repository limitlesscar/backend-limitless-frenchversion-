import { GenerateOTPOptions } from "src/types/common.type";
export declare const generateOTP: ({ length, options, }: {
    length: number;
    options: GenerateOTPOptions;
}) => number | string;
export declare const NUMERICAL_OTP: GenerateOTPOptions;
export declare const ALPHANUMERIC_OTP: GenerateOTPOptions;
export declare const TRULY_RANDOM_OTP: GenerateOTPOptions;
