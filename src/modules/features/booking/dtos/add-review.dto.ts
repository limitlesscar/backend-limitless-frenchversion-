import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class AddReviewDto {
  @ApiProperty({ name: "booking_id", required: true, example: 1 })
  @IsNumber({}, { message: "Booking Id must be of type number" })
  @IsNotEmpty({ message: "Booking Id must not be empty" })
  @Type(() => Number)
  booking_id: number;

  @ApiProperty({ name: "stars", required: true, example: 4 })
  @IsNumber({}, { message: "Stars must be of type number" })
  @IsNotEmpty({ message: "Stars must not be empty" })
  @Min(1, { message: "Stars should atleast be 1" })
  @Max(5, { message: "Stars cannot exceed the limit of 5" })
  @Type(() => Number)
  stars: number;

  @ApiProperty({
    name: "review_message",
    required: true,
    example: "Car was comfortable, will surely book again",
  })
  @IsNotEmpty({ message: "Review message must not be empty" })
  @IsString({ message: "Review Message should be of type string" })
  review_message: string;
}
