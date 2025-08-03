import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class AddFcmTokenDto {
  @ApiProperty({ name: "fcmToken" })
  @IsOptional()
  @IsString({ message: "Invalid String" })
  fcmToken: string;
}
