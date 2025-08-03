import { PaginationDto } from "src/types/pagination/common.dto";
import { BookingStatus } from "../../booking/enums/booking-status.enum";
export declare class OrdersDto extends PaginationDto {
    status: BookingStatus;
}
