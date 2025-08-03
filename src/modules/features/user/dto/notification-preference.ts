import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { USER_NOTIFICATION_PREFERENCE } from "../enums/notification-preference";

export class SetNotificationPreference {
  @ApiProperty({ name: "preference", enum: USER_NOTIFICATION_PREFERENCE })
  @IsNotEmpty()
  @IsEnum(USER_NOTIFICATION_PREFERENCE)
  preference: USER_NOTIFICATION_PREFERENCE;
}
