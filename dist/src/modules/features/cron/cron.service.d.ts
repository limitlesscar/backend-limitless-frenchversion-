import { BookingService } from "../booking/booking.service";
import { NotificationService } from "../notification/notification.service";
import { StripeService } from "src/modules/stripe/stripe.service";
import { CarService } from "../car/car.service";
export declare class CronService {
    private readonly bookingService;
    private readonly notificationService;
    private readonly stripeService;
    private readonly carService;
    constructor(bookingService: BookingService, notificationService: NotificationService, stripeService: StripeService, carService: CarService);
    triggerCompleteBooking(): Promise<void>;
    updateUpcomingBookingstoOngoing(): Promise<void>;
    reviewReminderNotification(): Promise<void>;
    unpublishExpiredCars(): Promise<void>;
}
