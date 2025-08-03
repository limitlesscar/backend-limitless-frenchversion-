import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "src/types/pagination/common.dto";
import { BookingStatus } from "../../booking/enums/booking-status.enum";
import { IsEnum, IsNotEmpty } from "class-validator";

export class OrdersDto extends PaginationDto {
  @ApiProperty({
    name: "status",
    enum: [
      BookingStatus.UPCOMING,
      BookingStatus.ONGOING,
      BookingStatus.COMPLETED,
    ],
  })
  @IsEnum(BookingStatus)
  @IsNotEmpty({ message: "Booking status cannot be empty" })
  status: BookingStatus;
}
