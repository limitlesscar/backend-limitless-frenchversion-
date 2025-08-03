import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { IsYearMonthDayFormat } from "src/decorators";
import { USER_TYPE_ENUM } from "../enums/user-role.enum";

export class DrivingDetailsDto {
  @ApiProperty({
    name: "user_type",
    description: "Type of user",
    required: false,
    example: USER_TYPE_ENUM.HOST || USER_TYPE_ENUM.USER,
  })
  @IsNotEmpty({ message: "User type cannot be empty" })
  @IsEnum(USER_TYPE_ENUM)
  user_type?: USER_TYPE_ENUM;

  @ApiProperty({
    name: "license_number",
    description: "Driving license number of the user",
    example: "1234567890",
    required: true,
  })
  @IsNotEmpty({ message: "Driving license number is required" })
  @MinLength(10, {
    message: "Driving license number should be at least 10 characters",
  })
  @IsString({ message: "Driving license number should be a valid stirng" })
  license_number: string;

  @ApiProperty({
    name: "expiry_date",
    description: "Expiry date of the driving license",
    example: "2030-01-01",
    required: true,
  })
  @IsNotEmpty({ message: "Expiry date is required" })
  @IsString({ message: "Expiry date should be a string" })
  @IsYearMonthDayFormat({
    message: "Expiry date should be in YYYY-MM-DD format",
  })
  expiry_date: string;
  @ApiProperty({
    name: "license_image",
    description: "Image of the driving license",
    example: "https://example.com/license.jpg",
    required: true,
  })
  @IsNotEmpty({ message: "License image is required" })
  @IsString({ message: "License image should be a string" })
  @IsUrl({}, { message: "Enter a valid URL" })
  license_image: string;
}
