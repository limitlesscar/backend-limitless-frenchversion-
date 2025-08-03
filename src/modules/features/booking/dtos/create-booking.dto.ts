import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class BookCarDto {
  @ApiProperty({
    name: "car_id",
    description: "Id of the car you want to book",
    example: 1,
  })
  @IsNotEmpty({ message: "Car Id cannot be empty" })
  @Type(() => Number)
  car_id: number;
  @ApiProperty({
    name: "start_date_time",
    description: "Start date time of the booking",
    example: "2024-12-25T12:00:00Z",
    required: false,
  })
  @IsNotEmpty({ message: "Start Date Time cannot be empty" })
  @IsString({ message: "Start date time should be a valid string" })
  start_date_time: string;
  @ApiProperty({
    name: "end_date_time",
    description: "End date time of the booking",
    example: "2024-12-25T12:00:00Z",
    required: false,
  })
  @IsString({ message: "End date time should be a valid string" })
  @IsNotEmpty({ message: "End Date Time cannot be empty" })
  end_date_time: string;
}

export class BookCarWithPaymentDto {
  @ApiProperty({
    name: "car_id",
    description: "Id of the car you want to book",
    example: 1,
  })
  @IsNotEmpty({ message: "Car Id cannot be empty" })
  @Type(() => Number)
  car_id: number;
}
