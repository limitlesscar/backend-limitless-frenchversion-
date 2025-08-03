import { AbstractEntity } from "src/modules/database/abstract.entity";
import { BookingStatus } from "../enums/booking-status.enum";
import { UserEntity } from "../../user/entities/user.entity";
import { CarEntity } from "../../car/entities/car.entity";
import { HostEntity } from "../../host/entities/host.entity";
import { BookingCancellationReason } from "../enums/cancellation-reasons.enum";
export declare class BookingEntity extends AbstractEntity {
    stars: number;
    review_message: string;
    start_date_time: string;
    end_date_time: string;
    amount: number;
    card_last_four: string;
    card_brand: string;
    payment_method_id: string;
    stripe_fees: string;
    stripe_charge_id: string;
    transfer_group: string;
    status: BookingStatus;
    is_rating_pending: boolean;
    is_refunded: boolean;
    cancellation_reason: BookingCancellationReason;
    user: UserEntity;
    host: HostEntity;
    car: CarEntity;
}
