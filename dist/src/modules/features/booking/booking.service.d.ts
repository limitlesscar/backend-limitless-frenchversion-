import { BookingRepository } from "./repositories/booking.repository";
import { BookingEntity } from "./entities/booking.entity";
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, FindOptionsOrder } from "typeorm";
import { HostEntity } from "../host/entities/host.entity";
import { HostService } from "../host/host.service";
import { StarsByCount } from "../car/interfaces/stars-by-count.interface";
import { BookCarDto } from "./dtos/create-booking.dto";
import { UserEntity } from "../user/entities/user.entity";
import { CarService } from "../car/car.service";
import { CancelBookingDto } from "./dtos/cancel-booking.dto";
import { NotificationService } from "../notification/notification.service";
import { AddReviewDto } from "./dtos/add-review.dto";
import { UserService } from "../user/user.service";
import { PaymentMethodDetails } from "./interfaces/payment-method-details.interface";
import { StripeService } from "src/modules/stripe/stripe.service";
import { ChatService } from "../chat/chat.service";
export declare class BookingService {
    private readonly bookingRepository;
    private readonly hostService;
    private readonly carService;
    private readonly userService;
    private readonly notficationService;
    private readonly stripeService;
    private readonly chatService;
    constructor(bookingRepository: BookingRepository, hostService: HostService, carService: CarService, userService: UserService, notficationService: NotificationService, stripeService: StripeService, chatService: ChatService);
    getBookingFromDB({ where, select, relations, }: {
        where?: FindOptionsWhere<BookingEntity>;
        select?: FindOptionsSelect<BookingEntity>;
        relations?: FindOptionsRelations<BookingEntity>;
    }): Promise<BookingEntity>;
    getallBookingsFromDB({ where, select, relations, skip, take, order, }: {
        where?: FindOptionsWhere<BookingEntity>;
        select?: FindOptionsSelect<BookingEntity>;
        relations?: FindOptionsRelations<BookingEntity>;
        take?: number;
        skip?: number;
        order?: FindOptionsOrder<BookingEntity>;
    }): Promise<[BookingEntity[], number]>;
    updateBooking({ data, where, relations, select, }: {
        data: Partial<BookingEntity>;
        where: FindOptionsWhere<BookingEntity>;
        relations?: FindOptionsRelations<BookingEntity>;
        select?: FindOptionsSelect<BookingEntity>;
    }): Promise<BookingEntity>;
    getHostWithRatings(hostId: number): Promise<{
        host: Partial<HostEntity>;
        stars: number;
    }>;
    calculateStarsByBookings(bookings: BookingEntity[]): StarsByCount;
    private checkBookingOverlap;
    BookCar({ car_id, start_date_time, end_date_time }: BookCarDto, user: Partial<UserEntity>): Promise<{
        isBookingValidated: boolean;
        extra_details: object;
    }>;
    BookCarWithPayment({ car_id, start_date_time, end_date_time }: BookCarDto, user_id: number, amount_in_cents: number, { brand, lastFour, payment_method_id, stripe_charge_id, transfer_group, }: PaymentMethodDetails): Promise<{
        message: string;
        booking: any;
    }>;
    getCarBookingDetails(booking_id: number, host_user_id: number): Promise<BookingEntity | {}>;
    getCarBookingDetailsForUser(booking_id: number, user_id: number): Promise<object>;
    cancelBooking(booking_id: number, { cancellation_reason }: CancelBookingDto, user_id: number): Promise<{
        message: string;
        booking: BookingEntity;
    }>;
    getAllValidBookingsOfCar(car_id: number): Promise<{
        id: number;
        start_date: string;
        start_time: string;
        end_date: string;
        end_time: string;
    }[]>;
    addReview(user: UserEntity, { booking_id, review_message, stars }: AddReviewDto): Promise<{
        message: string;
        booking: BookingEntity;
    }>;
}
