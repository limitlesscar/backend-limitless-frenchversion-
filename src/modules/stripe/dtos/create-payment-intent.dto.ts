import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsDateString, IsString } from "class-validator";

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: "Id of the car",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  car_id: number;
  @ApiProperty({
    description: "Name of the car",
    example: "Toyota Camry",
  })
  @IsNotEmpty()
  @IsString()
  car_name: string;
  @ApiProperty({
    description: "Start date and time of the booking",
    example: "2023-07-20T10:00:00Z",
  })
  @IsNotEmpty()
  @IsString()
  start_date_time: string;
  @ApiProperty({
    description: "End date and time of the booking",
    example: "2023-07-20T12:00:00Z",
  })
  @IsNotEmpty()
  @IsString()
  end_date_time: string;
  @ApiProperty({
    description: "Amount to be paid",
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  payable_amount: number;
  @ApiProperty({
    description: "Id of the logged in user",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
  @ApiProperty({
    description: "Id of the payment method",
    example: "paym_1MZ1f52eZvKYlo2C18f87NlX",
  })
  @IsNotEmpty()
  @IsString()
  payment_method_id: string;
}
