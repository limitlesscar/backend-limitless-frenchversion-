import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { PasswordMatch } from "src/decorators/password-match.decorator";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Old password of the user",
    example: "OldPassword123!",
  })
  @IsString({ message: "Old password must be a string." })
  @IsNotEmpty({ message: "Old password should not be empty." })
  old_password: string;

  @ApiProperty({
    description:
      "New password, must meet all validation requirements (8-20 characters, uppercase, lowercase, number, special character)",
    example: "NewPassword123!",
  })
  @IsNotEmpty({ message: "Password should not be empty." })
  @IsString({ message: "Password must be a string." })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  @Matches(/\d/, { message: "Password must contain at least one number." })
  @Matches(/[@$!%*?&]/, {
    message: "Password must contain at least one special character.",
  })
  new_password: string;

  @ApiProperty({
    description:
      "Confirmation of the new password, must match the new password exactly",
    example: "NewPassword123!",
  })
  @IsNotEmpty({ message: "Password should not be empty." })
  @IsString({ message: "Password must be a string." })
  @PasswordMatch("new_password", { message: "Passwords does not match." })
  confirm_password: string;
}
