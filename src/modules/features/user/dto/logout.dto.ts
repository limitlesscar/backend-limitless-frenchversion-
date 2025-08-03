import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LogoutDto {
  @ApiProperty({
    name: "id",
    description: "Id of the user whom you want to logout",
  })
  @IsInt({ message: "Id must be of integer type" })
  @IsNotEmpty({ message: "Id cannot be empty" })
  id: number;
  @ApiProperty({
    name: "fcm_token",
    description: "Fcm_token of the device where user is logged in",
  })
  @IsString({ message: "Fcm must be of type string" })
  @IsOptional()
  fcm_token?: string;
}
