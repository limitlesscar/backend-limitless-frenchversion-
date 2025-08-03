import { AbstractEntity } from "src/modules/database/abstract.entity";
import { CarEntity } from "src/modules/features/car/entities/car.entity";
import { BookingEntity } from "src/modules/features/booking/entities/booking.entity";
import { UserEntity } from "../../user/entities/user.entity";
export declare class HostEntity extends AbstractEntity {
    stripe_account_id: string;
    stripe_link: string;
    dashboard_login_link: string;
    user: UserEntity;
    cars: CarEntity[];
    bookings: BookingEntity[];
}
