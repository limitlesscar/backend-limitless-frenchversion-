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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./repositories/user.repository");
const user_role_enum_1 = require("./enums/user-role.enum");
const user_onboarding_status_enum_1 = require("./enums/user-onboarding-status.enum");
const format_cordinates_into_point_1 = require("../../../utils/format-cordinates-into-point");
const httpException_1 = require("../../../utils/app/httpException");
const axios_1 = require("axios");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
const fcm_token_repository_1 = require("./repositories/fcm_token.repository");
const bcrypt_1 = require("../../../utils/hashing/bcrypt");
const host_service_1 = require("../host/host.service");
const jwt_user_service_1 = require("../../core/jwt/services/jwt-user.service");
const booking_status_enum_1 = require("../booking/enums/booking-status.enum");
const booking_repository_1 = require("../booking/repositories/booking.repository");
const stripe_service_1 = require("../../stripe/stripe.service");
const notification_service_1 = require("../notification/notification.service");
let UserService = class UserService {
    constructor(userRepository, fcmTokenRepository, bookingRepository, hostService, jwtService, stripeService, notificationService) {
        this.userRepository = userRepository;
        this.fcmTokenRepository = fcmTokenRepository;
        this.bookingRepository = bookingRepository;
        this.hostService = hostService;
        this.jwtService = jwtService;
        this.stripeService = stripeService;
        this.notificationService = notificationService;
    }
    getUserFromDB({ where, select, relations, }) {
        return this.userRepository.findOne({
            where,
            select,
            relations,
        });
    }
    async updateUser({ data, where, relations, select, }) {
        await this.userRepository.update(where, data);
        return this.getUserFromDB({ where, relations, select });
    }
    async create(user) {
        const created = this.userRepository.create(user);
        return await this.userRepository.save(created);
    }
    async register({ email, password, first_name, last_name, phone_number, user_type, }) {
        const hashedPassword = (0, bcrypt_1.hashPassword)(password);
        email = email.toLowerCase();
        const user = await this.getUserFromDB({
            where: { email },
        });
        if (user) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.EMAIL_ALREADY_REGISTERED], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
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
            user_onboarding_status: user_onboarding_status_enum_1.ONBOARDING_STATUS.PERSONAL_DETAILS_PENDING,
            host_onboarding_status: user_onboarding_status_enum_1.ONBOARDING_STATUS.PERSONAL_DETAILS_PENDING,
        });
        if (!created) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CANNOT_CREATE_USER_AT_THIS_MOMENT], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const token = this.jwtService.generateJWT({
            id: created?.id,
            email: created?.email,
        });
        delete created.password;
        return {
            user: created,
            token,
            message: "User registered successfully!",
        };
    }
    async setPersonalDetails(user, { profile_picture, date_of_birth, emergency_contact, id_card_front, id_card_back, address, city, country, user_type, }) {
        try {
            let updatedUser;
            const isUserSignedUpAsHost = (user) => user &&
                user.user_type.includes(user_role_enum_1.USER_TYPE_ENUM.HOST) &&
                !user.user_type.includes(user_role_enum_1.USER_TYPE_ENUM.USER);
            const isHostSignedUpAsUser = (user) => user &&
                user.user_type.includes(user_role_enum_1.USER_TYPE_ENUM.USER) &&
                !user.user_type.includes(user_role_enum_1.USER_TYPE_ENUM.HOST);
            switch (user_type) {
                case user_role_enum_1.USER_TYPE_ENUM.USER:
                    if (isUserSignedUpAsHost(user)) {
                        user.user_type.push(user_role_enum_1.USER_TYPE_ENUM.USER);
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
                            user_onboarding_status: user_onboarding_status_enum_1.ONBOARDING_STATUS.DRIVING_DETAILS_PENDING,
                        },
                        relations: { host: true },
                    });
                    return {
                        message: "Personal details set successfully",
                        data: updatedUser,
                    };
                case user_role_enum_1.USER_TYPE_ENUM.HOST:
                    if (isHostSignedUpAsUser(user)) {
                        user.user_type.push(user_role_enum_1.USER_TYPE_ENUM.HOST);
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
                            host_onboarding_status: user_onboarding_status_enum_1.ONBOARDING_STATUS.DRIVING_DETAILS_PENDING,
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
                        const stripe_account_id = await this.stripeService.createHostStripeAccount(host.id);
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
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error.response?.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setDrivingDetails({ expiry_date, license_image, license_number, user_type, }, user) {
        try {
            if (new Date(expiry_date).toISOString() < new Date().toISOString()) {
                (0, httpException_1.throwHttpException)(["License has been expired"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            let updated;
            switch (user_type) {
                case user_role_enum_1.USER_TYPE_ENUM.USER:
                    updated = await this.updateUser({
                        where: { id: user.id },
                        data: {
                            license_image,
                            license_number,
                            expiry_date,
                            user_onboarding_status: user_onboarding_status_enum_1.ONBOARDING_STATUS.VERIFICATION_PENDING,
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
                case user_role_enum_1.USER_TYPE_ENUM.HOST:
                    if (!user.user_type.includes(user_role_enum_1.USER_TYPE_ENUM.USER)) {
                        user.user_type.push(user_role_enum_1.USER_TYPE_ENUM.USER);
                    }
                    updated = await this.updateUser({
                        where: { id: user.id },
                        data: {
                            license_image,
                            license_number,
                            expiry_date,
                            host_onboarding_status: user_onboarding_status_enum_1.ONBOARDING_STATUS.STRIPE_ONBOARDING_PENDING,
                            user_onboarding_status: user_onboarding_status_enum_1.ONBOARDING_STATUS.VERIFICATION_PENDING,
                            user_type: user.user_type,
                        },
                        relations: { host: true },
                    });
                    const host = await this.hostService.getHostFromDB({
                        where: { user: { id: user.id } },
                    });
                    const stripeLink = await this.stripeService.generateAccountLink(host?.stripe_account_id, host?.id);
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
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error?.response?.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async convertPointToCoordinates(user) {
        if (!user.location)
            return null;
        const coordinates = await this.userRepository
            .createQueryBuilder("user")
            .select(`jsonb_build_object(
            'long', ST_X(location::geometry), 
            'lat', ST_Y(location::geometry)
          )`, "location")
            .where("user.id = :id", { id: user.id })
            .getRawOne();
        return coordinates?.location;
    }
    async setLocation(user, { location }) {
        try {
            const { long, lat } = location;
            const point = (0, format_cordinates_into_point_1.formatCoordinatesIntoPoint)(long, lat);
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
        }
        catch (error) {
            (0, httpException_1.throwHttpException)(error.response?.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addFcmToken(token, userId) {
        try {
            const [existingToken, user] = await Promise.all([
                this.fcmTokenRepository.findOne({
                    where: { token, user: { id: userId } },
                }),
                this.getUserFromDB({ where: { id: userId } }),
            ]);
            if (existingToken)
                return;
            const fcmToken = this.fcmTokenRepository.create({
                token,
                user,
            });
            await this.fcmTokenRepository.save(fcmToken);
            return {
                message: "FCM token added successfully",
            };
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error?.response?.message || error.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeFcmToken(token, userId) {
        try {
            await this.fcmTokenRepository.softDelete({
                token,
                user: { id: userId },
            });
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.ERROR_IN_REMOVING_FCM], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async logout({ fcm_token, id }) {
        try {
            const user = await this.getUserFromDB({
                where: { id },
                relations: { fcm_token: true },
            });
            if (!user) {
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.USER_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
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
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.ERROR_IN_LOGOUT], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getUserFcmTokens(user_id) {
        const user = await this.getUserFromDB({
            where: { id: user_id },
            relations: { fcm_token: true },
        });
        if (!user?.fcm_token?.length) {
            return [];
        }
        return user.fcm_token.map((token) => token.token);
    }
    async changePassword(loggedInUser, { old_password, new_password }) {
        try {
            const user = await this.getUserFromDB({ where: { id: loggedInUser.id } });
            if (!(0, bcrypt_1.comparePassword)(old_password, user.password)) {
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.OLD_PASSWORD_DOESNOT_MATCH], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            if (old_password === new_password) {
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_PASSWORD], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const hashedPassword = (0, bcrypt_1.hashPassword)(new_password);
            await this.updateUser({
                where: { id: loggedInUser.id },
                data: { password: hashedPassword },
            });
            return {
                message: "Password changed successfully",
            };
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error.response?.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editUserProfile(loggedInUser, { first_name, last_name, phone_number, profile_picture, address, city, country, date_of_birth, emergency_contact, }) {
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
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)([error.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editDrivingDetails(loggedInUser, { expiry_date }) {
        try {
            if (new Date(expiry_date).toISOString() < new Date().toISOString()) {
                (0, httpException_1.throwHttpException)(["License has been expired"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
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
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error.response?.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async myOrders(user, { skip, take, status }) {
        if (!user.user_type.includes(user_role_enum_1.USER_TYPE_ENUM.USER)) {
            (0, httpException_1.throwHttpException)([`It looks empty here! You haven't booked any car yet`], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (status === booking_status_enum_1.BookingStatus.CANCELLED) {
            (0, httpException_1.throwHttpException)([
                "Booking status must have one of these values : [Upcoming,Ongoing,Completed]",
            ], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
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
    async ordersForMyCars(user, { skip, take, status }) {
        if (!user.user_type.includes(user_role_enum_1.USER_TYPE_ENUM.HOST)) {
            (0, httpException_1.throwHttpException)([`It looks empty here! You haven't published any car yet`], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (status === booking_status_enum_1.BookingStatus.CANCELLED) {
            (0, httpException_1.throwHttpException)([
                "Booking status must have one of these values : [Upcoming,Ongoing,Completed]",
            ], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
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
    async validateUserFromToken(token) {
        const jwt_data = await this.jwtService.decodeAuthToken({ token });
        return await this.getUserFromDB({
            where: { id: jwt_data?.id },
            select: { host: { id: true } },
            relations: { host: true },
        });
    }
    async updateUserNotificationPreference(user, { preference }) {
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
        }
        catch (error) {
            console.log(error.message);
            (0, httpException_1.throwHttpException)([error.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        fcm_token_repository_1.FcmTokenRepository,
        booking_repository_1.BookingRepository,
        host_service_1.HostService,
        jwt_user_service_1.JwtUserService,
        stripe_service_1.StripeService,
        notification_service_1.NotificationService])
], UserService);
//# sourceMappingURL=user.service.js.map