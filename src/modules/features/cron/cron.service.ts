import { Injectable } from "@nestjs/common";
import { BookingService } from "../booking/booking.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { BookingStatus } from "../booking/enums/booking-status.enum";
import { NotificationService } from "../notification/notification.service";
import { NOTIFICATIONS_MESSAGES } from "../notification/constants";
import { StripeService } from "src/modules/stripe/stripe.service";
import { CarService } from "../car/car.service";

@Injectable()
export class CronService {
  constructor(
    private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService,
    private readonly stripeService: StripeService,
    private readonly carService: CarService,
  ) {}
  @Cron(CronExpression.EVERY_10_MINUTES)
  async triggerCompleteBooking() {
    const now = new Date();

    const [ongoingBookings, total] =
      await this.bookingService.getallBookingsFromDB({
        where: { status: BookingStatus.ONGOING },
        select: {
          id: true,
          status: true,
          amount: true,
          transfer_group: true,
          stripe_charge_id: true,
          end_date_time: true,
          user: {
            id: true,
            full_name: true,
            fcm_token: { id: true, token: true },
          },
          host: {
            id: true,
            stripe_account_id: true,
            user: { id: true, fcm_token: { id: true, token: true } },
          },
          car: { id: true, name: true },
        },

        relations: {
          user: { fcm_token: true },
          host: { user: { fcm_token: true } },
          car: true,
        },
      });

    if (!total) {
      console.log("Cron job is running but there are no ongoing bookings");
    }
    const promises = ongoingBookings.map(async (booking) => {
      if (now < new Date(booking.end_date_time)) return;

      const [updatedBooking, transfer] = await Promise.all([
        await this.bookingService.updateBooking({
          where: { id: booking.id },
          data: { status: BookingStatus.COMPLETED },
        }),
        await this.stripeService.transferToHostConnectedAccount(
          booking.amount,
          booking.host.stripe_account_id,
          booking.transfer_group,
          booking.stripe_charge_id,
        ),
        await this.carService.updateCar({
          where: { id: booking.car.id },
          data: { isBooked: false },
        }),
      ]);

      const promises = [];

      if (booking.user.fcm_token?.length) {
        promises.push(
          this.notificationService.sendNotification({
            data: {
              navigate_to: "Booking",
              resource_id: booking.id.toString(),
              message: NOTIFICATIONS_MESSAGES.BOOKING_COMPLETED(
                booking.car.name,
              ).message,
              user: booking.user,
            },
            fcmTokens: booking.user.fcm_token.map(
              (user_token) => user_token.token,
            ),
          }),
        );
      }

      if (booking.host.user.fcm_token?.length) {
        promises.push(
          this.notificationService.sendNotification({
            data: {
              navigate_to: "Booking",
              resource_id: booking.id.toString(),
              message: NOTIFICATIONS_MESSAGES.DROP_OFF_COMPLETE,
              user: booking.host.user,
            },
            fcmTokens: booking.host.user.fcm_token.map(
              (user_token) => user_token.token,
            ),
          }),
        );
      }

      await Promise.all(promises);
    });

    await Promise.all(promises);
  }
  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateUpcomingBookingstoOngoing() {
    const [upcoming, total] = await this.bookingService.getallBookingsFromDB({
      where: { status: BookingStatus.UPCOMING },
      select: {
        id: true,
        start_date_time: true,
        end_date_time: true,
        status: true,
        car: { id: true, name: true, isBooked: true },
      },
      relations: { car: true },
    });
    if (total > 0) {
      const now = new Date(Date.now());
      for (const booking of upcoming) {
        if (now >= new Date(booking.start_date_time)) {
          const [updated] = await Promise.all([
            this.bookingService.updateBooking({
              where: { id: booking.id },
              data: { status: BookingStatus.ONGOING },
            }),
            this.carService.updateCar({
              where: { id: booking.car.id },
              data: { isBooked: true },
            }),
          ]);
          this.bookingService.updateBooking({
            where: { id: booking.id },
            data: { status: BookingStatus.ONGOING },
          });

          console.log(
            `Status of upcoming booking ${booking.id} is updated to ${updated.status}`,
          );
        }
        console.log(
          "Time has not arrived yet for upcoming bookings to update to ongoing bookings",
        );
      }
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async reviewReminderNotification() {
    const [pendingReviewCompletedBookings, total] =
      await this.bookingService.getallBookingsFromDB({
        where: { is_rating_pending: true, status: BookingStatus.COMPLETED },
        select: {
          id: true,
          user: {
            id: true,
            first_name: true,
            fcm_token: {
              id: true,
              token: true,
            },
          },
          car: {
            id: true,
            name: true,
          },
        },
        relations: { user: { fcm_token: true }, car: true },
      });
    if (total > 0) {
      for (const booking of pendingReviewCompletedBookings) {
        if (booking.user.fcm_token?.length > 0) {
          await this.notificationService.sendNotification({
            data: {
              navigate_to: "Booking",
              resource_id: booking.id.toString(),
              message: NOTIFICATIONS_MESSAGES.REVIEW_PENDING(
                booking.user.first_name,
                booking.car.name,
              ).message,
              user: booking.user,
            },
            fcmTokens: booking.user.fcm_token?.map(
              (user_token) => user_token.token,
            ),
          });
        }
      }
    }
  }
  @Cron(CronExpression.EVERY_5_MINUTES)
  async unpublishExpiredCars() {
    const [expiredCars, total] = await this.carService.getallCarsFromDB({
      where: {
        is_unpublished: false,
      },
      select: {
        id: true,
        name: true,
        is_unpublished: true,
        available_end_date_time: true,
        host: {
          id: true,
          user: {
            id: true,
            fcm_token: {
              id: true,
              token: true,
            },
          },
        },
      },
      relations: { host: { user: { fcm_token: true } } },
    });
    if (total > 0) {
      expiredCars.map(async (car) => {
        if (new Date(car.available_end_date_time) <= new Date(Date.now())) {
          await Promise.all([
            this.carService.updateCar({
              where: { id: car.id },
              data: { is_unpublished: true },
            }),
            this.notificationService.sendNotification({
              fcmTokens: car.host?.user?.fcm_token?.map(
                (user_token) => user_token.token,
              ),
              data: {
                user: car?.host?.user,
                navigate_to: "Car-Details",
                resource_id: car.id.toString(),
                message: NOTIFICATIONS_MESSAGES.CAR_EXPIRED(car.name).message,
              },
            }),
          ]);

          console.log(
            `CAR ${car.name} id-${car.id} is unpublished due to expiry`,
          );
        }
      });
    }
  }
}
