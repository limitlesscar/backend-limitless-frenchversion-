// Nest JS
import { ApiProperty } from "@nestjs/swagger";

// Class-validator
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { OTP_REASON_ENUM } from "src/modules/features/otp/enums/otp-reason.enum";

export class RequestOTPDTO {
  @ApiProperty({
    description: "Email of the user",
    example: "usaid@zenkoders.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // Reason
  @ApiProperty({
    description: "reason to request OTP",
    example: "FORGOT_PASSWORD",
    enum: OTP_REASON_ENUM,
  })
  @IsEnum(OTP_REASON_ENUM)
  @IsNotEmpty()
  reason: OTP_REASON_ENUM;
}
