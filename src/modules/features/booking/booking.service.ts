import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BookingRepository } from "./repositories/booking.repository";
import { BookingEntity } from "./entities/booking.entity";
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
  FindOptionsOrder,
  In,
} from "typeorm";

import { throwHttpException } from "src/utils/app/httpException";
import { HttpStatusCode } from "axios";
import { HostEntity } from "../host/entities/host.entity";
import { HostService } from "../host/host.service";
import { StarsByCount } from "../car/interfaces/stars-by-count.interface";
import { BookCarDto } from "./dtos/create-booking.dto";
import { UserEntity } from "../user/entities/user.entity";
import { CarService } from "../car/car.service";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { BookingStatus } from "./enums/booking-status.enum";
import { CancelBookingDto } from "./dtos/cancel-booking.dto";
import { NotificationService } from "../notification/notification.service";
import { AddReviewDto } from "./dtos/add-review.dto";
import { UserService } from "../user/user.service";
import { NOTIFICATIONS_MESSAGES } from "../notification/constants";
import { PaymentMethodDetails } from "./interfaces/payment-method-details.interface";
import { StripeService } from "src/modules/stripe/stripe.service";
import { ChatService } from "../chat/chat.service";
import { ChatType } from "../chat/enums/chat-type.enum";
import { formatDate, formatTime } from "src/utils/convertDate";

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly hostService: HostService,
    @Inject(forwardRef(() => CarService))
    private readonly carService: CarService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly notficationService: NotificationService,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    private readonly chatService: ChatService,
  ) {}
  // ============================================= GET BOOKING BY WHERE CLAUSE =============================================

  /**
   * Retrieves a single `BookingEntity` instance from the database based on the provided criteria.
   *
   * @param {Object} options - An object containing the parameters for the database query.
   * @param {FindOptionsWhere<BookingEntity>} [options.where] - An optional object specifying the criteria to find the booking.
   * @param {FindOptionsSelect<BookingEntity>} [options.select] - An optional parameter specifying the fields to be selected from the booking entity.
   * @param {FindOptionsRelations<BookingEntity>} [options.relations] - An optional parameter specifying the relations to be loaded for the booking entity.
   * @returns {Promise<BookingEntity>} - A Promise that resolves to the found `BookingEntity` instance.
   */
  getBookingFromDB({
    where,
    select,
    relations,
  }: {
    where?: FindOptionsWhere<BookingEntity>;
    select?: FindOptionsSelect<BookingEntity>;
    relations?: FindOptionsRelations<BookingEntity>;
  }): Promise<BookingEntity> {
    return this.bookingRepository.findOne({
      where,
      select,
      relations,
    });
  }

  // ============================================= GET ALL BOOKINGS BY WHERE CLAUSE =============================================

  /**
   * Retrieves a list of `BookingEntity` instances from the database based on the provided criteria.
   *
   * @param {Object} options - An object containing the parameters for the database query.
   * @param {FindOptionsWhere<BookingEntity>} [options.where] - An optional object specifying the criteria to find the bookings.
   * @param {FindOptionsSelect<BookingEntity>} [options.select] - An optional parameter specifying the fields to be selected from the booking entities.
   * @param {FindOptionsRelations<BookingEntity>} [options.relations] - An optional parameter specifying the relations to be loaded for the booking entities.
   * @param {number} [options.take] - An optional parameter specifying the maximum number of bookings to retrieve.
   * @param {number} [options.skip] - An optional parameter specifying the number of bookings to skip.
   * @returns {Promise<[BookingEntity[], number]>} - A Promise that resolves to an array of `BookingEntity` instances and the total count of bookings.
   */
  getallBookingsFromDB({
    where,
    select,
    relations,
    skip,
    take,
    order,
  }: {
    where?: FindOptionsWhere<BookingEntity>;
    select?: FindOptionsSelect<BookingEntity>;
    relations?: FindOptionsRelations<BookingEntity>;
    take?: number;
    skip?: number;
    order?: FindOptionsOrder<BookingEntity>;
  }): Promise<[BookingEntity[], number]> {
    return this.bookingRepository.findAndCount({
      where,
      select,
      relations,
      skip,
      take,
      order,
    });
  }

  /**
   * Updates an existing booking in the database with the provided data.
   *
   * @param {Object} options - An object containing the parameters for the update operation.
   * @param {Partial<BookingEntity>} options.data - The partial data object containing the updated booking information.
   * @param {FindOptionsWhere<BookingEntity>} options.where - An object specifying the criteria to find the booking to update.
   * @param {FindOptionsRelations<BookingEntity>} [options.relations] - An optional parameter specifying the relations to be loaded for the updated booking.
   * @param {FindOptionsSelect<BookingEntity>} [options.select] - An optional parameter specifying the fields to be selected from the updated booking.
   * @returns {Promise<BookingEntity>} - A Promise that resolves to the updated `BookingEntity` instance.
   */
  async updateBooking({
    data,
    where,
    relations,
    select,
  }: {
    data: Partial<BookingEntity>;
    where: FindOptionsWhere<BookingEntity>;
    relations?: FindOptionsRelations<BookingEntity>;
    select?: FindOptionsSelect<BookingEntity>;
  }): Promise<BookingEntity> {
    await this.bookingRepository.update(where, data);
    return this.getBookingFromDB({ where, relations, select });
  }

  async getHostWithRatings(
    hostId: number,
  ): Promise<{ host: Partial<HostEntity>; stars: number }> {
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
      const totalStars = hostBookings?.reduce(
        (acc, booking) => acc + booking.stars,
        0,
      );
      return {
        host,
        stars: Number((totalStars / total).toFixed(2)),
      };
    } catch (error) {
      throwHttpException(
        [error.response?.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  calculateStarsByBookings(bookings: BookingEntity[]): StarsByCount {
    const count: StarsByCount = {
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
  private checkBookingOverlap(
    newStart: Date,
    newEnd: Date,
    existingStart: Date,
    existingEnd: Date,
  ): boolean {
    const startsInExisting =
      newStart >= existingStart && newStart < existingEnd;
    const endsInExisting = newEnd > existingStart && newEnd <= existingEnd;
    const containsExisting = newStart <= existingStart && newEnd >= existingEnd;
    const containedInExisting =
      newStart >= existingStart && newEnd <= existingEnd;
    return (
      startsInExisting ||
      endsInExisting ||
      containsExisting ||
      containedInExisting
    );
  }
  async BookCar(
    { car_id, start_date_time, end_date_time }: BookCarDto,
    user: Partial<UserEntity>,
  ): Promise<{ isBookingValidated: boolean; extra_details: object }> {
    if (user?.is_rejected) {
      throwHttpException(
        ["Your profile is rejected, please edit your profile and resubmit"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user.is_rejected && !user.is_verified) {
      throwHttpException(
        ["Your profile is in review, please wait for approval"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const decoded_start_date_time = decodeURIComponent(start_date_time);
    const decoded_end_date_time = decodeURIComponent(end_date_time);
    const utc_start_date_time = new Date(decoded_start_date_time).toISOString();
    const utc_end_date_time = new Date(decoded_end_date_time).toISOString();
    const two_hours = 2 * 60 * 60 * 1000;
    if (utc_start_date_time >= utc_end_date_time) {
      throwHttpException(
        [ErrorMessages.DATE_TIME_ERROR],
        HttpStatusCode.NotAcceptable,
        HttpStatus.NOT_ACCEPTABLE,
      );
    } else if (
      new Date(decoded_end_date_time).getTime() -
        new Date(decoded_start_date_time).getTime() <
      two_hours
    ) {
      throwHttpException(
        [ErrorMessages.INVALID_BOOKING_SPAN],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const car = await this.carService.getCarFromDB({
      where: { id: car_id },
      relations: { host: true },
    });
    const pending_bookings = await this.getallBookingsFromDB({
      where: {
        car: { id: car_id },
        status: In([BookingStatus.ONGOING, BookingStatus.UPCOMING]),
      },
    });

    if (!car) {
      throwHttpException(
        [ErrorMessages.CAR_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    if (car.is_unpublished) {
      throwHttpException(
        [`This car is unpublished`],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (car.host.id === user.host?.id) {
      throwHttpException(
        [ErrorMessages.CANNOT_BOOK_SELF_OWNED_CAR],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      new Date(car.available_start_date_time) > new Date(utc_start_date_time) ||
      new Date(car.available_end_date_time) < new Date(utc_end_date_time)
    ) {
      throwHttpException(
        [ErrorMessages.CAR_NOT_AVAILABLE],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (pending_bookings[1] > 0) {
      for (const booking of pending_bookings[0]) {
        if (
          this.checkBookingOverlap(
            new Date(utc_start_date_time),
            new Date(utc_end_date_time),
            new Date(booking.start_date_time),
            new Date(booking.end_date_time),
          )
        ) {
          throwHttpException(
            [ErrorMessages.CAR_ALREADY_BOOKED],
            HttpStatusCode.BadRequest,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    const { amount } = this.carService.GetCarAmount(
      car.price_per_day,
      car.price_per_hour,
      utc_start_date_time,
      utc_end_date_time,
    );
    const extra_details = await this.carService.getCarRatingwithDetails(car_id);
    const details = {
      ...extra_details,
      booking_start_date_time: utc_start_date_time,
      booking_end_date_time: utc_end_date_time,
      payable_amount: amount,
    };
    return { isBookingValidated: true, extra_details: details };
  }
  async BookCarWithPayment(
    { car_id, start_date_time, end_date_time }: BookCarDto,
    user_id: number,
    amount_in_cents: number,
    {
      brand,
      lastFour,
      payment_method_id,
      stripe_charge_id,
      transfer_group,
    }: PaymentMethodDetails,
  ) {
    // PAYMENT DETAILS PENDING
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
      status: ongoing ? BookingStatus.ONGOING : BookingStatus.UPCOMING,
    });

    const created = await this.bookingRepository.save(booking);
    const host_tokens = await this.userService.getUserFcmTokens(
      car.host.user.id,
    );
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
            message: NOTIFICATIONS_MESSAGES.BOOKING_CREATED(
              booking.user.first_name,
              car.name,
            ).message,
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
    throwHttpException(
      ["Error in saving booking"],
      HttpStatusCode.BadRequest,
      HttpStatus.BAD_REQUEST,
    );
  }

  async getCarBookingDetails(
    booking_id: number,
    host_user_id: number,
  ): Promise<BookingEntity | {}> {
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

      const chat = await this.chatService.findChatByParticipantsAndType(
        host_user_id,
        details?.user?.id,
        ChatType.AS_HOST,
      );
      const res = { ...details, chat };

      return res || {};
    } catch (error) {
      throwHttpException(
        ["Error in fetching booking details"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getCarBookingDetailsForUser(
    booking_id: number,
    user_id: number,
  ): Promise<object> {
    const booking = await this.getBookingFromDB({
      where: { id: booking_id, user: { id: user_id } },
      relations: { car: true },
      select: {
        car: { id: true, name: true },
      },
    });
    if (!booking) {
      throwHttpException(
        ["Booking not found"],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    const car_details = await this.carService.getCarDetails(
      booking?.car.id,
      ChatType.AS_CUSTOMER,
      null,
      user_id,
    );
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

  async cancelBooking(
    booking_id: number,
    { cancellation_reason }: CancelBookingDto,
    user_id: number,
  ): Promise<{ message: string; booking: BookingEntity }> {
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
      throwHttpException(
        [ErrorMessages.BOOKING_DOESNOT_EXIST],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    if (booking.status !== BookingStatus.UPCOMING) {
      throwHttpException(
        [ErrorMessages.ERROR_IN_CANCELLING_BOOKING],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const now = Date.now();
    const twenty_four_hours = 24 * 60 * 60 * 1000;
    if (
      new Date(booking.start_date_time).getTime() - now <=
      twenty_four_hours
    ) {
      throwHttpException(
        [ErrorMessages.TWENTY_FOUR_HOURS_PASSED],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const refund = await this.stripeService.createRefund(
      booking.stripe_charge_id,
      // booking.id,
      // booking.transfer_group
    );
    if (refund && refund.status === "succeeded") {
      const [updatedBooking] = await Promise.all([
        this.updateBooking({
          where: { id: booking?.id },
          data: { status: BookingStatus.CANCELLED, cancellation_reason },
        }),
        this.carService.updateCar({
          where: { id: booking.car.id },
          data: { isBooked: false },
        }),
      ]);

      const host_fcmTokens = await this.userService.getUserFcmTokens(
        booking.host.id,
      );
      const user_fcmTokens = await this.userService.getUserFcmTokens(
        booking.user.id,
      );
      await Promise.all([
        this.notficationService.sendNotification({
          fcmTokens: host_fcmTokens,
          data: {
            message: NOTIFICATIONS_MESSAGES.BOOKING_CANCELLED(
              booking.car.name,
              booking.user.first_name,
            ).message,
            navigate_to: "Booking-Details",
            resource_id: booking_id.toString(),
            user: booking.host.user,
          },
        }),
        this.notficationService.sendNotification({
          fcmTokens: user_fcmTokens,
          data: {
            message: NOTIFICATIONS_MESSAGES.REFUND_COMPLETED(booking.car.name)
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
    throwHttpException(
      ["Error in cancelling booking"],
      HttpStatusCode.BadRequest,
      HttpStatus.BAD_REQUEST,
    );
  }
  async getAllValidBookingsOfCar(car_id: number): Promise<
    {
      id: number;
      start_date: string;
      start_time: string;
      end_date: string;
      end_time: string;
    }[]
  > {
    const [bookings, total] = await this.getallBookingsFromDB({
      where: {
        car: { id: car_id },
        status: In([BookingStatus.ONGOING, BookingStatus.UPCOMING]),
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
      start_date: formatDate(new Date(booking.start_date_time)),
      start_time: formatTime(new Date(booking.start_date_time)),
      end_date: formatDate(new Date(booking.end_date_time)),
      end_time: formatTime(new Date(booking.end_date_time)),
    }));
  }
  async addReview(
    user: UserEntity,
    { booking_id, review_message, stars }: AddReviewDto,
  ): Promise<{ message: string; booking: BookingEntity }> {
    const booking = await this.getBookingFromDB({
      where: { id: booking_id, user: { id: user?.id } },
      select: {
        car: { id: true, name: true },
        user: { id: true, first_name: true },
      },
      relations: { host: { user: { fcm_token: true } }, car: true, user: true },
    });
    if (!booking) {
      throwHttpException(
        [ErrorMessages.BOOKING_DOESNOT_EXIST],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    } else if (booking && booking.status !== BookingStatus.COMPLETED) {
      throwHttpException(
        [`Review can only be added to completed bookings`],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    } else if (booking && !booking.is_rating_pending) {
      throwHttpException(
        [`This booking has already been reviewed`],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
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
          message: NOTIFICATIONS_MESSAGES.REVIEW_COMPLETED(
            booking.car?.name,
            booking.user?.first_name,
          ).message,
          user: booking.host.user,
        },
      });
    }
    return {
      message: "Review added successfully",
      booking: reviewed_booking,
    };
  }
}
