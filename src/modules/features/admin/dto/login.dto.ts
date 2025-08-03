// Nest JS
import { ApiProperty } from "@nestjs/swagger";
// Class-validator
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class AdminLoginDTO {
  @ApiProperty({
    description: "Email of the admin",
    example: "admin@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    description: "Password of the admin",
    example: "admin123",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
