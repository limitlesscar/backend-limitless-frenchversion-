import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class SendNotificationDto {
  @ApiProperty({
    name: "fcmTokens",
    description: "Array of fcm tokens",
    required: false,
    isArray: true,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim());
    }
    return [];
  })
  @IsArray()
  fcmTokens: string[];
  @ApiProperty({ name: "body", description: "Notification Message" })
  @IsString()
  body: string;
  @ApiProperty({ name: "resource_id", description: "Notification Message" })
  @IsString()
  resource_id: string;
  @ApiProperty({ name: "navigateTo", description: "Notification Message" })
  @IsString()
  navigateTo: string;
}
