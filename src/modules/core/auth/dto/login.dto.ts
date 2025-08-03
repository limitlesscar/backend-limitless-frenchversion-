// Nest JS
import { ApiProperty } from "@nestjs/swagger";

// Class-validator
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
  @ApiProperty({
    description: "Email of the user",
    example: "usaid@zenkoders.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password of the user",
    example: "Password1!",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
