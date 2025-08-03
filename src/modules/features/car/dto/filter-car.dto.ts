import { ApiProperty } from "@nestjs/swagger";
import { VehicleType } from "../enums/vehicle-type.enum";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { CarFeatures } from "../enums/features.enum";
import { TransmissionType } from "../enums/transmission-type.enum";
import { EngineType } from "../enums/engine-type.enum";
import { CarBrand } from "../enums/brand.enum";
import { Transform, Type } from "class-transformer";

export class FilterCarDto {
  @ApiProperty({
    name: "vehicle_type",
    description: "Types of vehicle",
    isArray: true,
    required: false,
    example: [VehicleType.SPORTS_CAR, VehicleType.SUV],
  })
  @IsOptional()
  @IsEnum(VehicleType, { each: true })
  vehicle_type?: VehicleType[];
  @ApiProperty({
    name: "features",
    description: "Features of the car",
    required: false,
    isArray: true,
    example: [CarFeatures.ANDROID_AUTO, CarFeatures.AIR_CONDITIONING],
  })
  @IsOptional()
  @IsEnum(CarFeatures, { each: true })
  features?: CarFeatures[];

  @ApiProperty({
    name: "minimum_seats",
    description: "Minimum number of seats in the car",
    required: false,
    example: 3,
  })
  @Min(2, { message: "Minimum seats cannot be less than 2" })
  @Max(20, { message: "Minimum seats cannot exceed the limit of 10" })
  @IsOptional()
  @Type(() => Number)
  minimum_seats?: number;

  @ApiProperty({
    name: "total_price",
    description: "Amount limit for the car in Euros",
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Total price must be an integer" })
  total_price?: number;

  @ApiProperty({
    name: "less_than_five_years",
    description: "Age of the car",
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === "true" ? true : value === "false" ? false : value,
  )
  @IsBoolean({ message: "less_than_five_years must be a boolean" })
  less_than_five_years?: boolean;

  @ApiProperty({
    name: "gearbox",
    description: "Gearbox type of the car",
    required: false,
  })
  @IsOptional()
  @IsEnum(TransmissionType)
  gearbox?: TransmissionType;

  @ApiProperty({
    name: "engine_type",
    description: "Engine type of the car",
    required: false,
  })
  @IsOptional()
  @IsEnum(EngineType)
  engine_type?: EngineType;

  @ApiProperty({
    name: "brand",
    description: "Brand of the car",
    isArray: true,
    required: false,
    example: [CarBrand.AUDI, CarBrand.BMW, CarBrand.CHEVROLET],
  })
  @IsOptional()
  @IsEnum(CarBrand, { each: true })
  brand?: CarBrand[];
  @ApiProperty({
    name: "start_date_time",
    description: "Start date time of the booking",
    example: "2024-12-25T12:00:00Z",
    required: false,
  })
  @IsString({ message: "Start date time must be a string" })
  @IsOptional()
  start_date_time: string;
  @ApiProperty({
    name: "end_date_time",
    description: "End date time of the booking",
    example: "2024-12-25T12:00:00Z",
    required: false,
  })
  @IsString({ message: "End date time must be a string" })
  @IsOptional()
  end_date_time: string;
  @ApiProperty({
    name: "address",
    description: "Address of the user",
    example: "Ghulam Ishaq Khan Hall, University of Karachi",
    required: false,
  })
  @IsOptional()
  address: string;
  @ApiProperty({
    name: "skip",
    description: "Number of items to skip",
    example: 0,
  })
  @IsOptional()
  skip: number;
  @ApiProperty({
    name: "take",
    description: "Number of items to take",
    example: 10,
  })
  @IsOptional()
  take: number;
}
