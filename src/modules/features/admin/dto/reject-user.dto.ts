import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class RejectUserDto {
  @ApiProperty({
    name: "id",
    description: "Id of the user to be rejected",
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: "Id is required" })
  @Type(() => Number)
  id: number;
  @ApiProperty({
    name: "rejection_reason",
    description: "Reason for rejecting the user",
    example: "User is not eligible",
    required: true,
  })
  @IsNotEmpty({ message: "Reason is required" })
  @IsString({ message: "Reason must be a string" })
  rejection_reason: string;
}
