// Nest JS
import { ApiProperty } from "@nestjs/swagger";

// Class-validator
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { PasswordMatch } from "src/decorators/password-match.decorator";
import { USER_TYPE_ENUM } from "src/modules/features/user/enums/user-role.enum";

export class RegisterDTO {
  @ApiProperty({
    name: "first_name",
    description: "First name of the user",
    example: "Usaid",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "First Name should atleast contain 3 characters" })
  @MaxLength(20, { message: "First Name should not exceed 20 characters" })
  first_name: string;

  @ApiProperty({
    name: "last_name",
    description: "Last name of the user",
    example: "Asif",
  })
  @IsNotEmpty()
  @MinLength(3, { message: "Last Name should atleast contain 3 alphabets" })
  @MaxLength(20, { message: "Last Name should not exceed 20 characters" })
  @IsString()
  last_name: string;

  @ApiProperty({
    description: "Email of the user",
    example: "usaid@zenkoders.com",
  })
  @IsNotEmpty()
  @IsEmail({}, { message: "Enter a valid email address" })
  @IsString()
  email: string;

  @ApiProperty({
    description: "Password of the user",
    example: "Password1!",
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
  @Matches(/[@$!%*?&#+,"./:;()_=\-`{}|<>~^]/, {
    message: "Password must contain at least one special character.",
  })
  password: string;

  @ApiProperty({
    description: "Password of the user",
    example: "Password1!",
  })
  @IsNotEmpty({ message: "Password should not be empty." })
  @IsString({ message: "Password must be a string." })
  @PasswordMatch("password", { message: "Passwords does not match." })
  confirmPassword: string;

  @ApiProperty({
    name: "phone_number",
    description: "Phone Number of the user",
    example: "+923182516827",
  })
  @IsNotEmpty({ message: "Phone Number should not be empty." })
  @IsString({ message: "Phone Number must be a string." })
  phone_number: string;

  @ApiProperty({
    name: "user_type",
    description: "Type of the user",
    example: "user or host",
    enum: [USER_TYPE_ENUM.HOST, USER_TYPE_ENUM.USER],
    // default: USER_TYPE_ENUM.USER,
  })
  @IsEnum(USER_TYPE_ENUM)
  @IsNotEmpty({ message: "User Type should not be empty." })
  user_type: USER_TYPE_ENUM;
}
