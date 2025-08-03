// Nest JS
import { ApiProperty } from "@nestjs/swagger";

// Class-validator
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { PasswordMatch } from "src/decorators/password-match.decorator";

export class ForgotPasswordDTO {
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: "usaid@zenkoders.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    description: "Code OTP",
    example: 1234,
  })
  @IsNotEmpty()
  @IsNumber()
  otp: number;
  @ApiProperty({
    description: "Nouveau mot de passe de l'utilisateur",
    example: "newPassword1!",
  })
  @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide." })
  @IsString({ message: "Le mot de passe doit être une chaîne de caractères." })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/[a-z]/, {
    message: "Le mot de passe doit contenir au moins une lettre minuscule.",
  })
  @Matches(/[A-Z]/, {
    message: "Le mot de passe doit contenir au moins une lettre majuscule.",
  })
  @Matches(/\d/, {
    message: "Le mot de passe doit contenir au moins un chiffre.",
  })
  @Matches(/[@$!%*?&#+,"./:;()_=\-`{}|<>~^]/, {
    message: "Le mot de passe doit contenir au moins un caractère spécial.",
  })
  password: string;
  @ApiProperty({
    description: "Confirmation du nouveau mot de passe de l'utilisateur",
    example: "Password1!",
  })
  @IsNotEmpty({
    message: "La confirmation du mot de passe ne doit pas être vide.",
  })
  @IsString({
    message:
      "La confirmation du mot de passe doit être une chaîne de caractères.",
  })
  @PasswordMatch("password", {
    message: "Les mots de passe ne correspondent pas.",
  })
  confirmPassword: string;
}
