import { Repository } from "typeorm";
import { BookingEntity } from "../entities/booking.entity";
export declare class BookingRepository extends Repository<BookingEntity> {
    constructor(bookingRepository: Repository<BookingEntity>);
}
