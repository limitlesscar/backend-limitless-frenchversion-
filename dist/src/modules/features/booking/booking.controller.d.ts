import { BookingService } from "./booking.service";
import { CustomRequest } from "src/types/common.type";
import { BookCarDto } from "./dtos/create-booking.dto";
import { BookingEntity } from "./entities/booking.entity";
import { CancelBookingDto } from "./dtos/cancel-booking.dto";
import { AddReviewDto } from "./dtos/add-review.dto";
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    GetBookingById(id: number, { user }: CustomRequest): Promise<BookingEntity | {}>;
    GetBookingByIdea(id: number, { user }: CustomRequest): Promise<BookingEntity | {}>;
    validateBooking(bookCarDto: BookCarDto, { user }: CustomRequest): Promise<{
        isBookingValidated: boolean;
        extra_details: object;
    }>;
    AddReviewToBooking(addReviewDto: AddReviewDto, { user }: CustomRequest): Promise<{
        message: string;
        booking: BookingEntity;
    }>;
    CancelBooking(cancelBookingDto: CancelBookingDto, id: number, { user }: CustomRequest): Promise<{
        message: string;
        booking: BookingEntity;
    }>;
}
