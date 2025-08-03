import { ApiProperty } from "@nestjs/swagger";
import { BookingCancellationReason } from "../enums/cancellation-reasons.enum";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CancelBookingDto {
  @ApiProperty({
    name: "cancellation_reason",
    enum: [BookingCancellationReason.CHANGE_DETAILS_OF_JOURNEY],
  })
  @IsNotEmpty({ message: "Cancellation reason cannot be empty" })
  @IsEnum(BookingCancellationReason)
  cancellation_reason: BookingCancellationReason;
}
