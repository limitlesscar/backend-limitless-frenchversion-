// Nest JS
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

// TypeORM
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from "typeorm";
// Entities
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { PersonalDetailsDto } from "./dto/personal-details.dto";
import { USER_TYPE_ENUM } from "./enums/user-role.enum";
import { ONBOARDING_STATUS } from "./enums/user-onboarding-status.enum";
import { DrivingDetailsDto } from "./dto/driving-details.dto";
import { formatCoordinatesIntoPoint } from "src/utils/format-cordinates-into-point";
import { LocationDto } from "./dto/set-location.dto";
import { throwHttpException } from "src/utils/app/httpException";
import { HttpStatusCode } from "axios";
import { LogoutDto } from "./dto/logout.dto";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { FcmTokenRepository } from "./repositories/fcm_token.repository";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { comparePassword, hashPassword } from "src/utils/hashing/bcrypt";
import { UserEditProfileDTO } from "./dto/edit-profile.dto";
import { EditDrivingDetailsDto } from "./dto/edit-driving-details.dto";
import { HostService } from "../host/host.service";
import { RegisterDTO } from "src/modules/core/auth/dto/register.dto";
import { JwtUserService } from "src/modules/core/jwt/services/jwt-user.service";
import { BookingStatus } from "../booking/enums/booking-status.enum";
import { OrdersDto } from "./dto/my-orders.dto";
import { BookingEntity } from "../booking/entities/booking.entity";
import { BookingRepository } from "../booking/repositories/booking.repository";
import { StripeService } from "src/modules/stripe/stripe.service";
import { NotificationService } from "../notification/notification.service";
import { Coordinates } from "src/types/common.type";
import { SetNotificationPreference } from "./dto/notification-preference";

// interface SuccessResponse<T> {
//   message: string;
//   data: T;
// }

type SuccessResponse<T> = { message: string; data: T };

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fcmTokenRepository: FcmTokenRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly hostService: HostService,
    private readonly jwtService: JwtUserService,
    private readonly stripeService: StripeService,
    private readonly notificationService: NotificationService,
  ) {}

  // ============================================= GET USER BY ID =============================================
  /**
   * @description This method retrieves a user entity by its unique identifier (id).
   *
   * @param {Object} options - An object containing the necessary parameters for finding the user.
   * @param {string} options.id - The unique identifier of the user to be retrieved.
   * @param {FindOptionsSelect<UserEntity>} [options.select] - An optional parameter specifying the fields to be selected from the user entity.
   * @param {FindOptionsRelations<UserEntity>} [options.relations] - An optional parameter specifying the relations to be loaded for the user entity.
   *
   * @returns {Promise<UserEntity>} - Returns a Promise that resolves to the found user entity.
   *
   * @throws {Error} - If an error occurs during the database operation.
   *
   * @example
   * const user = await userRepository.getUserFromDB({ id: '123456' });
   * console.log(user);
   */
  getUserFromDB({
    where,
    select,
    relations,
  }: {
    where?: FindOptionsWhere<UserEntity>;
    select?: FindOptionsSelect<UserEntity>;
    relations?: FindOptionsRelations<UserEntity>;
  }): Promise<UserEntity> {
    return this.userRepository.findOne({
      where,
      select,
      relations,
    });
  }

  // ============================================= Update USER =============================================
  /**
   * @description This method updates an existing user entity based on the provided criteria.
   *
   * @param {Object} options - An object containing the necessary parameters for updating the user.
   * @param {Partial<UserEntity>} options.data - An object containing the updated user data.
   * @param {FindOptionsWhere<UserEntity>} options.where - An object specifying the criteria to find the user to be updated.
   * @param {FindOptionsRelations<UserEntity>} [options.relations] - An optional parameter specifying the relations to be loaded for the updated user entity.
   * @param {FindOptionsSelect<UserEntity>} [options.select] - An optional parameter specifying the fields to be selected from the updated user entity.
   *
   * @returns {Promise<UserEntity>} - Returns a Promise that resolves to the updated user entity.
   *
   * @throws {Error} - If an error occurs during the database operation.
   *
   * @example
   * const updatedUser = await userRepository.updateUser({
   *   data: { name: 'John Doe' },
   *   where: { id: '123456' },
   *   relations: ['role'],
   *   select: ['id', 'name', 'email'],
   * });
   * console.log(updatedUser);
   */
  async updateUser({
    data,
    where,
    relations,
    select,
  }: {
    data: Partial<UserEntity>;
    where: FindOptionsWhere<UserEntity>;
    relations?: FindOptionsRelations<UserEntity>;
    select?: FindOptionsSelect<UserEntity>;
  }): Promise<UserEntity> {
    await this.userRepository.update(where, data);
    return this.getUserFromDB({ where, relations, select });
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const created = this.userRepository.create(user);
    return await this.userRepository.save(created);
  }
  // ======================================================= Register =======================================================
  /**
   * @description This method is used to register a new user by onboarding them and generating a JSON Web Token (JWT) for authentication.
   *
   * @param {Object} options - An object containing the necessary parameters for registering the user.
   * @param {string} options.email - The email address of the user.
   * @param {string} options.password - The password of the user.
   * @param {string} options.date_of_birth - The date of birth of the user.
   *
   * @returns {Promise<{ user: UserEntity; token: string; message: string }>} - Returns a Promise that resolves to an object containing the registered user entity, the generated JWT, and a success message.
   *
   * @throws {HttpException} - If the user is not found, already onboarded, or cannot be onboarded due to their current status.
   * @throws {Error} - If an error occurs during the onboarding or JWT generation process.
   *
   * @example
   * const response = await userRepository.register({
   *   email: 'user@example.com',
   *   password: 'password123',
   *   date_of_birth: '1990-01-01',
   * });
   * Logger.log(response.user, response.token, response.message);
   */
  async register({
    email,
    password,
    first_name,
    last_name,
    phone_number,
    user_type,
  }: RegisterDTO): Promise<{
    user: UserEntity;
    token: string;
    message: string;
  }> {
    const hashedPassword = hashPassword(password);
    email = email.toLowerCase();
    const user = await this.getUserFromDB({
      where: { email },
    });
    if (user) {
      throwHttpException(
        [ErrorMessages.EMAIL_ALREADY_REGISTERED],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }

    const customer_id = await this.stripeService.createCustomer(email);
    const created = await this.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      full_name: `${first_name} ${last_name}`,
      phone_number,
      user_type: [user_type],
      stripe_customer_id: customer_id,

      user_onboarding_status: ONBOARDING_STATUS.PERSONAL_DETAILS_PENDING,

      host_onboarding_status: ONBOARDING_STATUS.PERSONAL_DETAILS_PENDING,
    });

    if (!created) {
      throwHttpException(
        [ErrorMessages.CANNOT_CREATE_USER_AT_THIS_MOMENT],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.generateJWT({
      id: created?.id,
      email: created?.email,
    } as Partial<UserEntity> as UserEntity);

    delete created.password;

    return {
      user: created,
      token,
      message: "User registered successfully!",
    };
  }

  async setPersonalDetails(
    user: UserEntity,
    {
      profile_picture,
      date_of_birth,
      emergency_contact,
      id_card_front,
      id_card_back,
      address,
      city,
      country,
      user_type,
    }: PersonalDetailsDto,
  ): Promise<SuccessResponse<Partial<UserEntity>>> {
    try {
      let updatedUser: UserEntity;

      const isUserSignedUpAsHost = (user: UserEntity) =>
        user &&
        user.user_type.includes(USER_TYPE_ENUM.HOST) &&
        !user.user_type.includes(USER_TYPE_ENUM.USER);

      const isHostSignedUpAsUser = (user: UserEntity) =>
        user &&
        user.user_type.includes(USER_TYPE_ENUM.USER) &&
        !user.user_type.includes(USER_TYPE_ENUM.HOST);

      switch (user_type) {
        case USER_TYPE_ENUM.USER:
          if (isUserSignedUpAsHost(user)) {
            user.user_type.push(USER_TYPE_ENUM.USER);
          }

          updatedUser = await this.updateUser({
            where: { id: user.id },
            data: {
              user_type: user.user_type,
              profile_picture,
              date_of_birth,
              emergency_contact,
              id_card_front,
              id_card_back,
              address,
              city,
              country,
              user_onboarding_status: ONBOARDING_STATUS.DRIVING_DETAILS_PENDING,
            },
            relations: { host: true },
          });
          return {
            message: "Personal details set successfully",
            data: updatedUser,
          };
        case USER_TYPE_ENUM.HOST:
          if (isHostSignedUpAsUser(user)) {
            user.user_type.push(USER_TYPE_ENUM.HOST);
          }

          updatedUser = await this.updateUser({
            where: { id: user.id },
            data: {
              user_type: user.user_type,
              profile_picture,
              date_of_birth,
              emergency_contact,
              id_card_front,
              id_card_back,
              address,
              city,
              country,
              host_onboarding_status: ONBOARDING_STATUS.DRIVING_DETAILS_PENDING,
            },
            relations: { host: true },
          });
          const hostExist = await this.hostService.getHostFromDB({
            where: { user: { id: user.id } },
          });
          if (!hostExist) {
            const host = await this.hostService.createHost({
              user: updatedUser,
            });
            const stripe_account_id =
              await this.stripeService.createHostStripeAccount(host.id);
            await this.hostService.updateHost({
              where: { id: host.id },
              data: { stripe_account_id: stripe_account_id },
            });
          }
          return {
            message: "Personal details set successfully",
            data: updatedUser,
          };
      }
    } catch (error) {
      console.log(error);
      throwHttpException(
        error.response?.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ============================== SET DRIVING DETAILS ==============================
  /**
   * Updates the driving details for the specified user.
   *
   * @param expiry_date - The expiry date of the user's driver's license.
   * @param license_image - The image of the user's driver's license.
   * @param license_number - The number of the user's driver's license.
   * @param user - The user entity whose driving details are to be updated.
   * @returns An object with a success message, the updated user entity, and a flag indicating that verification is pending.
   * @throws {HttpException} If an error occurs during the update of the driving details.
   */
  async setDrivingDetails(
    {
      expiry_date,
      license_image,
      license_number,
      user_type,
    }: DrivingDetailsDto,
    user: UserEntity,
  ): Promise<{
    message: string;
    user: UserEntity;
    isVerificationPending: boolean;
    stripeLink: string | null;
  }> {
    try {
      if (new Date(expiry_date).toISOString() < new Date().toISOString()) {
        throwHttpException(
          ["License has been expired"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }
      let updated: UserEntity;
      switch (user_type) {
        case USER_TYPE_ENUM.USER:
          updated = await this.updateUser({
            where: { id: user.id },
            data: {
              license_image,
              license_number,
              expiry_date,
              user_onboarding_status: ONBOARDING_STATUS.VERIFICATION_PENDING,
            },
            relations: { host: true },
          });
          delete updated.password;
          return {
            message: "Driving details updated successfully",
            user: updated,
            isVerificationPending: true,
            stripeLink: null,
          };
        case USER_TYPE_ENUM.HOST:
          if (!user.user_type.includes(USER_TYPE_ENUM.USER)) {
            user.user_type.push(USER_TYPE_ENUM.USER);
          }
          updated = await this.updateUser({
            where: { id: user.id },
            data: {
              license_image,
              license_number,
              expiry_date,
              host_onboarding_status:
                ONBOARDING_STATUS.STRIPE_ONBOARDING_PENDING,
              user_onboarding_status: ONBOARDING_STATUS.VERIFICATION_PENDING,
              user_type: user.user_type,
            },
            relations: { host: true },
          });
          const host = await this.hostService.getHostFromDB({
            where: { user: { id: user.id } },
          });
          const stripeLink = await this.stripeService.generateAccountLink(
            host?.stripe_account_id,
            host?.id,
          );
          await this.hostService.updateHost({
            where: { id: host?.id },
            data: { stripe_account_id: host?.stripe_account_id },
          });
          delete updated.password;
          return {
            message: "Driving details updated successfully",
            user: updated,
            isVerificationPending: false,
            stripeLink: stripeLink,
          };
      }
    } catch (error) {
      console.log(error);
      throwHttpException(
        error?.response?.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async convertPointToCoordinates(
    user: UserEntity,
  ): Promise<Coordinates | null> {
    if (!user.location) return null;

    const coordinates = await this.userRepository
      .createQueryBuilder("user")
      .select(
        `jsonb_build_object(
            'long', ST_X(location::geometry), 
            'lat', ST_Y(location::geometry)
          )`,
        "location",
      )
      .where("user.id = :id", { id: user.id })
      .getRawOne();

    return coordinates?.location;
  }
  // ========================= SET USER LOCATION =========================
  /**
   * Updates the location of the specified user.
   *
   * @param user - The user entity whose location is to be updated.
   * @param location - An object containing the longitude and latitude values to update the user's location.
   * @returns An object with a success message and the updated user entity (with only the id, full_name, and location.coordinates fields).
   * @throws {HttpException} If an error occurs during the location update.
   */
  async setLocation(
    user: UserEntity,
    { location }: LocationDto,
  ): Promise<{ message: string; user: Partial<UserEntity> }> {
    try {
      const { long, lat } = location;
      const point = formatCoordinatesIntoPoint(long, lat);
      const updated = await this.updateUser({
        where: { id: user.id },
        data: { location: point ? point : null },
        select: {
          id: true,
          full_name: true,
          location: { coordinates: true },
        },
      });
      delete updated.password;
      return {
        message: "Location updated successfully",
        user: updated,
      };
    } catch (error) {
      throwHttpException(
        error.response?.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ========================== ADD FCM TOKEN ==========================
  /**
   * Adds the specified FCM token for the given user ID.
   *
   * @param token - The FCM token to be added.
   * @param userId - The ID of the user whose FCM token should be added.
   * @returns A promise that resolves to an object with a success message.
   * @throws {HttpException} If an error occurs during the addition of the FCM token.
   */
  async addFcmToken(
    token: string,
    userId: number,
  ): Promise<{ message: string }> {
    try {
      const [existingToken, user] = await Promise.all([
        this.fcmTokenRepository.findOne({
          where: { token, user: { id: userId } },
        }),
        this.getUserFromDB({ where: { id: userId } }),
      ]);

      if (existingToken) return;

      const fcmToken = this.fcmTokenRepository.create({
        token,
        user,
      });

      await this.fcmTokenRepository.save(fcmToken);
      return {
        message: "FCM token added successfully",
      };
    } catch (error) {
      throwHttpException(
        [error?.response?.message || error.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ================================ REMOVE FCM TOKEN ================================
  /**
   * Removes the specified FCM token for the given user ID.
   *
   * @param token - The FCM token to be removed.
   * @param userId - The ID of the user whose FCM token should be removed.
   * @returns A promise that resolves when the FCM token is successfully removed.
   * @throws {HttpException} If an error occurs during the removal of the FCM token.
   */
  async removeFcmToken(token: string, userId: number): Promise<void> {
    try {
      await this.fcmTokenRepository.softDelete({
        token,
        user: { id: userId },
      });
    } catch (error) {
      throwHttpException(
        [ErrorMessages.ERROR_IN_REMOVING_FCM],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ============================== LOGOUT ==============================
  /**
   * Logs out the user and removes their FCM token if provided.
   *
   * @param fcm_token - The FCM token of the user to be removed.
   * @param id - The ID of the user to be logged out.
   * @returns A promise that resolves to an object with a success message.
   * @throws {HttpException} If the user is not found or an error occurs during the logout process.
   */
  async logout({ fcm_token, id }: LogoutDto): Promise<{ message: string }> {
    try {
      const user = await this.getUserFromDB({
        where: { id },
        relations: { fcm_token: true },
      });

      if (!user) {
        throwHttpException(
          [ErrorMessages.USER_NOT_FOUND],
          HttpStatusCode.NotFound,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!fcm_token) {
        return {
          message: "User logged out successfully",
        };
      }

      await this.removeFcmToken(fcm_token, user?.id);
      return {
        message: "User logged out successfully",
      };
    } catch (error) {
      throwHttpException(
        [ErrorMessages.ERROR_IN_LOGOUT],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ============================== FETCH USER FCM TOKEN ==============================
  async getUserFcmTokens(user_id: number): Promise<string[]> {
    const user = await this.getUserFromDB({
      where: { id: user_id },
      relations: { fcm_token: true },
    });
    if (!user?.fcm_token?.length) {
      return [];
    }

    return user.fcm_token.map((token) => token.token);
  }
  // ============================== CHANGE PASSWORD ==============================
  /**
   * Changes the password of the logged-in user.
   *
   * @param loggedInUser - The logged-in user entity.
   * @param { old_password, new_password } - The old and new passwords.
   * @returns A promise that resolves to an object with a success message.
   * @throws {HttpException} If the old password does not match, the new password is invalid, or an error occurs during the update.
   */
  async changePassword(
    loggedInUser: UserEntity,
    { old_password, new_password }: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.getUserFromDB({ where: { id: loggedInUser.id } });
      if (!comparePassword(old_password, user.password)) {
        throwHttpException(
          [ErrorMessages.OLD_PASSWORD_DOESNOT_MATCH],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (old_password === new_password) {
        throwHttpException(
          [ErrorMessages.INVALID_PASSWORD],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword = hashPassword(new_password);
      await this.updateUser({
        where: { id: loggedInUser.id },
        data: { password: hashedPassword },
      });
      return {
        message: "Password changed successfully",
      };
    } catch (error) {
      throwHttpException(
        [error.response?.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ============================== EDIT USER PROFILE ==============================
  async editUserProfile(
    loggedInUser: UserEntity,
    {
      first_name,
      last_name,
      phone_number,
      profile_picture,
      address,
      city,
      country,
      date_of_birth,
      emergency_contact,
    }: UserEditProfileDTO,
  ): Promise<{ message: string; user: Partial<UserEntity> }> {
    try {
      const updatedUser = await this.updateUser({
        where: { id: loggedInUser.id },
        data: {
          first_name,
          last_name,
          full_name: `${first_name} ${last_name}`,
          phone_number,
          profile_picture,
          date_of_birth,
          address,
          city,
          country,
          emergency_contact,
          is_rejected: loggedInUser.is_rejected
            ? false
            : loggedInUser.is_rejected,
          is_verified: loggedInUser.is_rejected
            ? false
            : loggedInUser.is_verified,
        },
        relations: { host: true },
      });

      return {
        message: "User profile updated successfully",
        user: updatedUser,
      };
    } catch (error) {
      console.log(error);
      throwHttpException(
        [error.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ============================== EDIT DRIVING DETAILS ==============================
  async editDrivingDetails(
    loggedInUser: UserEntity,
    { expiry_date }: EditDrivingDetailsDto,
  ): Promise<{ message: string; user: Partial<UserEntity> }> {
    try {
      if (new Date(expiry_date).toISOString() < new Date().toISOString()) {
        throwHttpException(
          ["License has been expired"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }
      const updatedUser = await this.updateUser({
        where: { id: loggedInUser.id },
        data: {
          expiry_date,
          is_rejected: loggedInUser.is_rejected
            ? false
            : loggedInUser.is_rejected,
          is_verified: loggedInUser.is_rejected
            ? false
            : loggedInUser.is_verified,
        },
      });
      delete updatedUser.password;
      return {
        message: "Driving details updated successfully",
        user: { ...updatedUser, expiry_date },
      };
    } catch (error) {
      throwHttpException(
        [error.response?.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ============================== MY ORDERS ==============================
  async myOrders(
    user: Partial<UserEntity>,
    { skip, take, status }: OrdersDto,
  ): Promise<{ orders: BookingEntity[]; hasMore: boolean }> {
    if (!user.user_type.includes(USER_TYPE_ENUM.USER)) {
      throwHttpException(
        [`It looks empty here! You haven't booked any car yet`],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (status === BookingStatus.CANCELLED) {
      throwHttpException(
        [
          "Booking status must have one of these values : [Upcoming,Ongoing,Completed]",
        ],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bookings = this.bookingRepository.createQueryBuilder("booking");
    bookings.innerJoin("booking.host", "host");
    bookings.innerJoin("booking.car", "car");
    bookings.innerJoin("host.user", "user");
    bookings.where("booking.status = :status", { status });
    bookings.andWhere("booking.user_id=:userId", { userId: user.id });
    bookings.orderBy("booking.createdAt", "DESC");
    bookings.select([
      "car.id id",
      "car.name name",
      "car.images images",
      "car.price_per_hour price_per_hour",
      "car.price_per_day price_per_day",
      `json_build_object('id',booking.id,'amount',booking.amount,'start_date_time',booking.start_date_time,'end_date_time',booking.end_date_time,'status',booking.status,'stars',booking.stars,'is_rating_pending',booking.is_rating_pending)as booking`,
      `json_build_object('id',host.id,'host_user_id',"user"."id",'first_name',"user"."first_name",'last_name',"user"."last_name",'full_name',"user"."full_name",'profile_picture',"user"."profile_picture",'address',"user"."address")as host`,
    ]);
    bookings.offset(skip);
    bookings.limit(take);
    const total = await bookings.getCount();
    const orders = await bookings.getRawMany();
    const hasMore = total > skip + orders.length;
    return {
      orders,
      hasMore,
    };
  }
  // ============================== MY ORDERS ==============================
  async ordersForMyCars(
    user: Partial<UserEntity>,
    { skip, take, status }: OrdersDto,
  ): Promise<{ orders: BookingEntity[]; hasMore: boolean }> {
    if (!user.user_type.includes(USER_TYPE_ENUM.HOST)) {
      throwHttpException(
        [`It looks empty here! You haven't published any car yet`],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (status === BookingStatus.CANCELLED) {
      throwHttpException(
        [
          "Booking status must have one of these values : [Upcoming,Ongoing,Completed]",
        ],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bookings = this.bookingRepository.createQueryBuilder("booking");
    bookings.innerJoin("booking.host", "host");
    bookings.innerJoin("booking.car", "car");
    bookings.innerJoin("host.user", "user");
    bookings.where("booking.status = :status", { status });
    bookings.andWhere("host.id=:hostId", { hostId: user?.host?.id });
    bookings.orderBy("booking.createdAt", "DESC");

    bookings.select([
      "car.id id",
      "car.name name",
      "car.images images",
      "car.price_per_hour price_per_hour",
      "car.price_per_day price_per_day",
      `json_build_object('id',booking.id,'amount',booking.amount,'start_date_time',booking.start_date_time,'end_date_time',booking.end_date_time,'status',booking.status,'stars',booking.stars,'is_rating_pending',booking.is_rating_pending)as booking`,
      `json_build_object('id',"user"."id",'first_name',"user"."first_name",'last_name',"user"."last_name",'full_name',"user"."full_name",'profile_picture',"user"."profile_picture",'address',"user"."address")as user`,
    ]);
    bookings.offset(skip);
    bookings.limit(take);
    const total = await bookings.getCount();
    const orders = await bookings.getRawMany();
    const hasMore = total > skip + orders.length;
    return {
      orders,
      hasMore,
    };
  }
  async validateUserFromToken(token: string): Promise<UserEntity> {
    const jwt_data = await this.jwtService.decodeAuthToken({ token });
    return await this.getUserFromDB({
      where: { id: jwt_data?.id },
      select: { host: { id: true } },
      relations: { host: true },
    });
  }

  async updateUserNotificationPreference(
    user: UserEntity,
    { preference }: SetNotificationPreference,
  ): Promise<{ message: string; user: UserEntity }> {
    try {
      const updatedUser = await this.updateUser({
        where: { id: user.id },
        data: { notification_preference: preference },
        select: { id: true, notification_preference: true },
      });
      return {
        message: "Préférence de notification mise à jour avec succès",
        user: updatedUser,
      };
    } catch (error) {
      console.log(error.message);
      throwHttpException(
        [error.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
