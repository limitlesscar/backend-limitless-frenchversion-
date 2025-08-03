import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
  ValidateIf,
} from "class-validator";
import { USER_TYPE_ENUM } from "../enums/user-role.enum";
import { IsYearMonthDayFormat } from "src/decorators";

export class PersonalDetailsDto {
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
    name: "profile_picture",
    description: "Profile picture of the user",
    example: "https://example.com/profile.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: "Enter a valid URL" })
  profile_picture: string;

  @ApiProperty({
    name: "date_of_birth",
    description: "Date of birth of the user",
    example: "2000-01-01",
    required: true,
  })
  @IsNotEmpty({ message: "Date of birth is required" })
  @IsString({ message: "Date of birth should be a string" })
  @IsYearMonthDayFormat({
    message: "Date of birth should be in YYYY-MM-DD format",
  })
  date_of_birth: string;

  @ApiProperty({
    name: "emergency_contact",
    description: "Emergency contact of the user",
    example: "+923001234567",
    required: false,
  })
  @IsString({ message: "Emergency contact should be a string" })
  @IsOptional()
  emergency_contact: string;

  @ApiProperty({
    name: "id_card_front",
    description: "Front side of the ID card",
    example: "https://example.com/id_card_front.jpg",
    required: true,
  })
  @IsNotEmpty({ message: "ID card front is required" })
  @IsString({ message: "ID card front should be a string" })
  @IsUrl({}, { message: "Enter a valid URL" })
  id_card_front: string;

  @ApiProperty({
    name: "id_card_back",
    description: "Back side of the ID card",
    example: "https://example.com/id_card_back.jpg",
    required: true,
  })
  @IsNotEmpty({ message: "ID card back is required" })
  @IsString({ message: "ID card back should be a string" })
  @IsUrl({}, { message: "Enter a valid URL" })
  id_card_back: string;

  @ApiProperty({
    name: "country",
    description: "Country of the user",
    example: "Pakistan",
    required: false,
  })
  @IsString({ message: "Country should be a string" })
  @IsNotEmpty({ message: "Country is required " })
  country: string;

  @ApiProperty({
    name: "city",
    description: "City of the user",
    example: "Karachi",
    required: false,
  })
  @IsString({ message: "City should be a string" })
  @IsNotEmpty({ message: "City is required " })
  city: string;

  @ApiProperty({
    name: "address",
    description: "Address of the user",
    example: "Ghulam Ishaq Khan Hall, University of Karachi",
    required: false,
  })
  @IsNotEmpty({ message: "Address is required " })
  address: string;
}
