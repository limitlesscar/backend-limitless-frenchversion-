import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSetupIntentDto {
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
    name: "payment_method_id",
    description: "Payment method id",
    example: "pm_1234567890",
    required: true,
  })
  @IsString({ message: "Payment method should be a string" })
  @IsNotEmpty({ message: "Payment method is required" })
  payment_method_id: string;
}
