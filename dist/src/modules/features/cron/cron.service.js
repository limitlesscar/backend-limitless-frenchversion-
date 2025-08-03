"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("../booking/booking.service");
const schedule_1 = require("@nestjs/schedule");
const booking_status_enum_1 = require("../booking/enums/booking-status.enum");
const notification_service_1 = require("../notification/notification.service");
const constants_1 = require("../notification/constants");
const stripe_service_1 = require("../../stripe/stripe.service");
const car_service_1 = require("../car/car.service");
let CronService = class CronService {
    constructor(bookingService, notificationService, stripeService, carService) {
        this.bookingService = bookingService;
        this.notificationService = notificationService;
        this.stripeService = stripeService;
        this.carService = carService;
    }
    async triggerCompleteBooking() {
        const now = new Date();
        const [ongoingBookings, total] = await this.bookingService.getallBookingsFromDB({
            where: { status: booking_status_enum_1.BookingStatus.ONGOING },
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
            if (now < new Date(booking.end_date_time))
                return;
            const [updatedBooking, transfer] = await Promise.all([
                await this.bookingService.updateBooking({
                    where: { id: booking.id },
                    data: { status: booking_status_enum_1.BookingStatus.COMPLETED },
                }),
                await this.stripeService.transferToHostConnectedAccount(booking.amount, booking.host.stripe_account_id, booking.transfer_group, booking.stripe_charge_id),
                await this.carService.updateCar({
                    where: { id: booking.car.id },
                    data: { isBooked: false },
                }),
            ]);
            const promises = [];
            if (booking.user.fcm_token?.length) {
                promises.push(this.notificationService.sendNotification({
                    data: {
                        navigate_to: "Booking",
                        resource_id: booking.id.toString(),
                        message: constants_1.NOTIFICATIONS_MESSAGES.BOOKING_COMPLETED(booking.car.name).message,
                        user: booking.user,
                    },
                    fcmTokens: booking.user.fcm_token.map((user_token) => user_token.token),
                }));
            }
            if (booking.host.user.fcm_token?.length) {
                promises.push(this.notificationService.sendNotification({
                    data: {
                        navigate_to: "Booking",
                        resource_id: booking.id.toString(),
                        message: constants_1.NOTIFICATIONS_MESSAGES.DROP_OFF_COMPLETE,
                        user: booking.host.user,
                    },
                    fcmTokens: booking.host.user.fcm_token.map((user_token) => user_token.token),
                }));
            }
            await Promise.all(promises);
        });
        await Promise.all(promises);
    }
    async updateUpcomingBookingstoOngoing() {
        const [upcoming, total] = await this.bookingService.getallBookingsFromDB({
            where: { status: booking_status_enum_1.BookingStatus.UPCOMING },
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
                            data: { status: booking_status_enum_1.BookingStatus.ONGOING },
                        }),
                        this.carService.updateCar({
                            where: { id: booking.car.id },
                            data: { isBooked: true },
                        }),
                    ]);
                    this.bookingService.updateBooking({
                        where: { id: booking.id },
                        data: { status: booking_status_enum_1.BookingStatus.ONGOING },
                    });
                    console.log(`Status of upcoming booking ${booking.id} is updated to ${updated.status}`);
                }
                console.log("Time has not arrived yet for upcoming bookings to update to ongoing bookings");
            }
        }
    }
    async reviewReminderNotification() {
        const [pendingReviewCompletedBookings, total] = await this.bookingService.getallBookingsFromDB({
            where: { is_rating_pending: true, status: booking_status_enum_1.BookingStatus.COMPLETED },
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
                            message: constants_1.NOTIFICATIONS_MESSAGES.REVIEW_PENDING(booking.user.first_name, booking.car.name).message,
                            user: booking.user,
                        },
                        fcmTokens: booking.user.fcm_token?.map((user_token) => user_token.token),
                    });
                }
            }
        }
    }
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
                            fcmTokens: car.host?.user?.fcm_token?.map((user_token) => user_token.token),
                            data: {
                                user: car?.host?.user,
                                navigate_to: "Car-Details",
                                resource_id: car.id.toString(),
                                message: constants_1.NOTIFICATIONS_MESSAGES.CAR_EXPIRED(car.name).message,
                            },
                        }),
                    ]);
                    console.log(`CAR ${car.name} id-${car.id} is unpublished due to expiry`);
                }
            });
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "triggerCompleteBooking", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "updateUpcomingBookingstoOngoing", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_10PM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "reviewReminderNotification", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "unpublishExpiredCars", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService,
        notification_service_1.NotificationService,
        stripe_service_1.StripeService,
        car_service_1.CarService])
], CronService);
//# sourceMappingURL=cron.service.js.map