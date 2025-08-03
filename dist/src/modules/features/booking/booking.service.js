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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const booking_repository_1 = require("./repositories/booking.repository");
const typeorm_1 = require("typeorm");
const httpException_1 = require("../../../utils/app/httpException");
const axios_1 = require("axios");
const host_service_1 = require("../host/host.service");
const car_service_1 = require("../car/car.service");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
const booking_status_enum_1 = require("./enums/booking-status.enum");
const notification_service_1 = require("../notification/notification.service");
const user_service_1 = require("../user/user.service");
const constants_1 = require("../notification/constants");
const stripe_service_1 = require("../../stripe/stripe.service");
const chat_service_1 = require("../chat/chat.service");
const chat_type_enum_1 = require("../chat/enums/chat-type.enum");
const convertDate_1 = require("../../../utils/convertDate");
let BookingService = class BookingService {
    constructor(bookingRepository, hostService, carService, userService, notficationService, stripeService, chatService) {
        this.bookingRepository = bookingRepository;
        this.hostService = hostService;
        this.carService = carService;
        this.userService = userService;
        this.notficationService = notficationService;
        this.stripeService = stripeService;
        this.chatService = chatService;
    }
    getBookingFromDB({ where, select, relations, }) {
        return this.bookingRepository.findOne({
            where,
            select,
            relations,
        });
    }
    getallBookingsFromDB({ where, select, relations, skip, take, order, }) {
        return this.bookingRepository.findAndCount({
            where,
            select,
            relations,
            skip,
            take,
            order,
        });
    }
    async updateBooking({ data, where, relations, select, }) {
        await this.bookingRepository.update(where, data);
        return this.getBookingFromDB({ where, relations, select });
    }
    async getHostWithRatings(hostId) {
        try {
            const host = await this.hostService.getHostFromDB({
                where: { id: hostId },
                select: {
                    id: true,
                    user: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        full_name: true,
                        profile_picture: true,
                    },
                },
                relations: { user: true },
            });
            const [hostBookings, total] = await this.getallBookingsFromDB({
                where: { host: { id: hostId } },
            });
            const totalStars = hostBookings?.reduce((acc, booking) => acc + booking.stars, 0);
            return {
                host,
                stars: Number((totalStars / total).toFixed(2)),
            };
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error.response?.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    calculateStarsByBookings(bookings) {
        const count = {
            "5": 0,
            "4": 0,
            "3": 0,
            "2": 0,
            "1": 0,
        };
        bookings?.map((booking) => {
            switch (booking.stars) {
                case 5:
                    count[5] = count[5] + 1;
                    break;
                case 4:
                    count[4] = count[4] + 1;
                    break;
                case 3:
                    count[3] = count[3] + 1;
                    break;
                case 2:
                    count[2] = count[2] + 1;
                    break;
                case 1:
                    count[1] = count[1] + 1;
                    break;
            }
        });
        return count;
    }
    checkBookingOverlap(newStart, newEnd, existingStart, existingEnd) {
        const startsInExisting = newStart >= existingStart && newStart < existingEnd;
        const endsInExisting = newEnd > existingStart && newEnd <= existingEnd;
        const containsExisting = newStart <= existingStart && newEnd >= existingEnd;
        const containedInExisting = newStart >= existingStart && newEnd <= existingEnd;
        return (startsInExisting ||
            endsInExisting ||
            containsExisting ||
            containedInExisting);
    }
    async BookCar({ car_id, start_date_time, end_date_time }, user) {
        if (user?.is_rejected) {
            (0, httpException_1.throwHttpException)(["Your profile is rejected, please edit your profile and resubmit"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!user.is_rejected && !user.is_verified) {
            (0, httpException_1.throwHttpException)(["Your profile is in review, please wait for approval"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const decoded_start_date_time = decodeURIComponent(start_date_time);
        const decoded_end_date_time = decodeURIComponent(end_date_time);
        const utc_start_date_time = new Date(decoded_start_date_time).toISOString();
        const utc_end_date_time = new Date(decoded_end_date_time).toISOString();
        const two_hours = 2 * 60 * 60 * 1000;
        if (utc_start_date_time >= utc_end_date_time) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.DATE_TIME_ERROR], axios_1.HttpStatusCode.NotAcceptable, common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        else if (new Date(decoded_end_date_time).getTime() -
            new Date(decoded_start_date_time).getTime() <
            two_hours) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_BOOKING_SPAN], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const car = await this.carService.getCarFromDB({
            where: { id: car_id },
            relations: { host: true },
        });
        const pending_bookings = await this.getallBookingsFromDB({
            where: {
                car: { id: car_id },
                status: (0, typeorm_1.In)([booking_status_enum_1.BookingStatus.ONGOING, booking_status_enum_1.BookingStatus.UPCOMING]),
            },
        });
        if (!car) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CAR_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        if (car.is_unpublished) {
            (0, httpException_1.throwHttpException)([`This car is unpublished`], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (car.host.id === user.host?.id) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CANNOT_BOOK_SELF_OWNED_CAR], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (new Date(car.available_start_date_time) > new Date(utc_start_date_time) ||
            new Date(car.available_end_date_time) < new Date(utc_end_date_time)) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CAR_NOT_AVAILABLE], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (pending_bookings[1] > 0) {
            for (const booking of pending_bookings[0]) {
                if (this.checkBookingOverlap(new Date(utc_start_date_time), new Date(utc_end_date_time), new Date(booking.start_date_time), new Date(booking.end_date_time))) {
                    (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CAR_ALREADY_BOOKED], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
                }
            }
        }
        const { amount } = this.carService.GetCarAmount(car.price_per_day, car.price_per_hour, utc_start_date_time, utc_end_date_time);
        const extra_details = await this.carService.getCarRatingwithDetails(car_id);
        const details = {
            ...extra_details,
            booking_start_date_time: utc_start_date_time,
            booking_end_date_time: utc_end_date_time,
            payable_amount: amount,
        };
        return { isBookingValidated: true, extra_details: details };
    }
    async BookCarWithPayment({ car_id, start_date_time, end_date_time }, user_id, amount_in_cents, { brand, lastFour, payment_method_id, stripe_charge_id, transfer_group, }) {
        const user = await this.userService.getUserFromDB({
            where: { id: user_id },
        });
        const car = await this.carService.getCarFromDB({
            where: { id: car_id },
            relations: { host: { user: true } },
        });
        const decoded_start_date_time = decodeURIComponent(start_date_time);
        const decoded_end_date_time = decodeURIComponent(end_date_time);
        const now = new Date();
        const utc_start_date_time = new Date(decoded_start_date_time).toISOString();
        const utc_end_date_time = new Date(decoded_end_date_time).toISOString();
        const ongoing = new Date(utc_start_date_time) <= now;
        const booking = this.bookingRepository.create({
            car,
            start_date_time: utc_start_date_time,
            end_date_time: utc_end_date_time,
            user,
            amount: amount_in_cents / 100,
            host: car.host,
            status: ongoing ? booking_status_enum_1.BookingStatus.ONGOING : booking_status_enum_1.BookingStatus.UPCOMING,
        });
        const created = await this.bookingRepository.save(booking);
        const host_tokens = await this.userService.getUserFcmTokens(car.host.user.id);
        if (created) {
            await Promise.all([
                await this.updateBooking({
                    where: { id: created.id },
                    data: {
                        payment_method_id,
                        card_last_four: lastFour,
                        card_brand: brand,
                        stripe_charge_id,
                        transfer_group,
                    },
                }),
                await this.notficationService.sendNotification({
                    fcmTokens: host_tokens,
                    data: {
                        message: constants_1.NOTIFICATIONS_MESSAGES.BOOKING_CREATED(booking.user.first_name, car.name).message,
                        navigate_to: "Booking-Details",
                        resource_id: created.id.toString(),
                        user: car.host.user,
                    },
                }),
            ]);
            return {
                message: "Car booked successfully",
                booking: created,
            };
        }
        (0, httpException_1.throwHttpException)(["Error in saving booking"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
    }
    async getCarBookingDetails(booking_id, host_user_id) {
        try {
            const car_booking = this.bookingRepository.createQueryBuilder("booking");
            car_booking.innerJoin("booking.user", "user");
            car_booking.innerJoin("booking.car", "car");
            car_booking.where("booking.id= :booking_id", { booking_id });
            car_booking.select([
                "car.id id",
                "car.name name",
                "car.images images",
                "car.price_per_hour price_per_hour",
                "car.price_per_day price_per_day",
                `json_build_object('id',booking.id,'amount',booking.amount,'start_date_time',booking.start_date_time,'end_date_time',booking.end_date_time,'status',booking.status,'stars',booking.stars,'card_brand',booking.card_brand,'card_last_four',booking.card_last_four,'is_rating_pending',booking.is_rating_pending)as booking`,
                `json_build_object('id',"user"."id",'full_name',"user"."full_name",'profile_picture',"user"."profile_picture",'phone_number',"user"."phone_number",'date_of_birth',"user"."date_of_birth",'emergency_contact',"user"."emergency_contact",'license_number',"user"."license_number",'expiry_date',"user"."expiry_date")as user`,
            ]);
            const details = await car_booking.getRawOne();
            const chat = await this.chatService.findChatByParticipantsAndType(host_user_id, details?.user?.id, chat_type_enum_1.ChatType.AS_HOST);
            const res = { ...details, chat };
            return res || {};
        }
        catch (error) {
            (0, httpException_1.throwHttpException)(["Error in fetching booking details"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCarBookingDetailsForUser(booking_id, user_id) {
        const booking = await this.getBookingFromDB({
            where: { id: booking_id, user: { id: user_id } },
            relations: { car: true },
            select: {
                car: { id: true, name: true },
            },
        });
        if (!booking) {
            (0, httpException_1.throwHttpException)(["Booking not found"], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        const car_details = await this.carService.getCarDetails(booking?.car.id, chat_type_enum_1.ChatType.AS_CUSTOMER, null, user_id);
        const booking_details = {
            id: booking.id,
            booking_start_date_time: booking.start_date_time,
            booking_end_date_time: booking.end_date_time,
            is_rating_pending: booking.is_rating_pending,
        };
        return {
            ...car_details,
            booking_details,
        };
    }
    async cancelBooking(booking_id, { cancellation_reason }, user_id) {
        const booking = await this.getBookingFromDB({
            where: { id: booking_id, user: { id: user_id } },
            relations: { user: true, car: true, host: { user: true } },
            select: {
                user: {
                    id: true,
                    first_name: true,
                    notification_preference: true,
                    fcm_token: { id: true, token: true },
                },
                car: { id: true, name: true },
                host: {
                    id: true,
                    user: { id: true, full_name: true, notification_preference: true },
                },
            },
        });
        if (!booking) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.BOOKING_DOESNOT_EXIST], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        if (booking.status !== booking_status_enum_1.BookingStatus.UPCOMING) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.ERROR_IN_CANCELLING_BOOKING], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const now = Date.now();
        const twenty_four_hours = 24 * 60 * 60 * 1000;
        if (new Date(booking.start_date_time).getTime() - now <=
            twenty_four_hours) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.TWENTY_FOUR_HOURS_PASSED], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const refund = await this.stripeService.createRefund(booking.stripe_charge_id);
        if (refund && refund.status === "succeeded") {
            const [updatedBooking] = await Promise.all([
                this.updateBooking({
                    where: { id: booking?.id },
                    data: { status: booking_status_enum_1.BookingStatus.CANCELLED, cancellation_reason },
                }),
                this.carService.updateCar({
                    where: { id: booking.car.id },
                    data: { isBooked: false },
                }),
            ]);
            const host_fcmTokens = await this.userService.getUserFcmTokens(booking.host.id);
            const user_fcmTokens = await this.userService.getUserFcmTokens(booking.user.id);
            await Promise.all([
                this.notficationService.sendNotification({
                    fcmTokens: host_fcmTokens,
                    data: {
                        message: constants_1.NOTIFICATIONS_MESSAGES.BOOKING_CANCELLED(booking.car.name, booking.user.first_name).message,
                        navigate_to: "Booking-Details",
                        resource_id: booking_id.toString(),
                        user: booking.host.user,
                    },
                }),
                this.notficationService.sendNotification({
                    fcmTokens: user_fcmTokens,
                    data: {
                        message: constants_1.NOTIFICATIONS_MESSAGES.REFUND_COMPLETED(booking.car.name)
                            .message,
                        navigate_to: "Booking-Details",
                        resource_id: booking_id.toString(),
                        user: booking.user,
                    },
                }),
            ]);
            return {
                message: "Booking has been cancelled successfully",
                booking: updatedBooking,
            };
        }
        (0, httpException_1.throwHttpException)(["Error in cancelling booking"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
    }
    async getAllValidBookingsOfCar(car_id) {
        const [bookings, total] = await this.getallBookingsFromDB({
            where: {
                car: { id: car_id },
                status: (0, typeorm_1.In)([booking_status_enum_1.BookingStatus.ONGOING, booking_status_enum_1.BookingStatus.UPCOMING]),
            },
            select: {
                id: true,
                start_date_time: true,
                end_date_time: true,
                createdAt: true,
            },
            order: { createdAt: "DESC" },
        });
        total;
        return bookings?.map((booking) => ({
            id: booking.id,
            start_date: (0, convertDate_1.formatDate)(new Date(booking.start_date_time)),
            start_time: (0, convertDate_1.formatTime)(new Date(booking.start_date_time)),
            end_date: (0, convertDate_1.formatDate)(new Date(booking.end_date_time)),
            end_time: (0, convertDate_1.formatTime)(new Date(booking.end_date_time)),
        }));
    }
    async addReview(user, { booking_id, review_message, stars }) {
        const booking = await this.getBookingFromDB({
            where: { id: booking_id, user: { id: user?.id } },
            select: {
                car: { id: true, name: true },
                user: { id: true, first_name: true },
            },
            relations: { host: { user: { fcm_token: true } }, car: true, user: true },
        });
        if (!booking) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.BOOKING_DOESNOT_EXIST], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        else if (booking && booking.status !== booking_status_enum_1.BookingStatus.COMPLETED) {
            (0, httpException_1.throwHttpException)([`Review can only be added to completed bookings`], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        else if (booking && !booking.is_rating_pending) {
            (0, httpException_1.throwHttpException)([`This booking has already been reviewed`], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const reviewed_booking = await this.updateBooking({
            where: { id: booking.id },
            data: { review_message, stars, is_rating_pending: false },
        });
        if (booking.host.user.fcm_token?.length > 0) {
            const fcmTokens = booking.host.user.fcm_token.map((user) => user.token);
            await this.notficationService.sendNotification({
                fcmTokens,
                data: {
                    message: constants_1.NOTIFICATIONS_MESSAGES.REVIEW_COMPLETED(booking.car?.name, booking.user?.first_name).message,
                    user: booking.host.user,
                },
            });
        }
        return {
            message: "Review added successfully",
            booking: reviewed_booking,
        };
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => car_service_1.CarService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => stripe_service_1.StripeService))),
    __metadata("design:paramtypes", [booking_repository_1.BookingRepository,
        host_service_1.HostService,
        car_service_1.CarService,
        user_service_1.UserService,
        notification_service_1.NotificationService,
        stripe_service_1.StripeService,
        chat_service_1.ChatService])
], BookingService);
//# sourceMappingURL=booking.service.js.map