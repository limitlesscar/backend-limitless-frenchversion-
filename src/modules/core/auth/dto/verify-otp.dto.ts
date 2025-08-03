// Nest JS
import { ApiProperty } from "@nestjs/swagger";

// Class-validator
import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { OTP_REASON_ENUM } from "src/modules/features/otp/enums/otp-reason.enum";

export class VerifyOtpDTO {
  @ApiProperty({
    description: "Email de l’utilisateur",
    example: "usaid@zenkoders.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    description: "Code OTP",
  })
  @IsNotEmpty()
  @IsNumber({}, { message: "Code invalide" })
  otp: number;
  @ApiProperty({
    name: "reason",
    description: "Type de vérification",
    example: "FORGOT_PASSWORD",
  })
  @IsNotEmpty()
  @IsEnum(OTP_REASON_ENUM)
  reason: OTP_REASON_ENUM;
}
