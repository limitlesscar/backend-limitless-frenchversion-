import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class ListPaymentMethodDto {
  @ApiProperty({
    name: "customer_id",
    description: "Id of the customer",
    example: "cus_1234567890",
    required: true,
  })
  @IsString({ message: "Customer id should be a string" })
  @IsNotEmpty({ message: "Customer id is required" })
  customer_id: string;
  @ApiProperty({
    name: "limit",
    description: "Limit of the payment methods",
    example: 10,
    required: false,
  })
  @IsNumber({}, { message: "Limit should be a number" })
  @Type(() => Number)
  @IsNotEmpty({ message: "Limit is required" })
  limit: number;
}
