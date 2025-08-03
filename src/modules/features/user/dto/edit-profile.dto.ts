import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from "class-validator";
import { IsYearMonthDayFormat } from "src/decorators";
import { RegisterDTO } from "src/modules/core/auth/dto/register.dto";

export class UserEditProfileDTO extends PartialType(
  OmitType(RegisterDTO, ["email", "password", "confirmPassword", "user_type"]),
) {
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
