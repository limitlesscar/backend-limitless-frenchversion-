import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { PersonalDetailsDto } from "./dto/personal-details.dto";
import { DrivingDetailsDto } from "./dto/driving-details.dto";
import { LocationDto } from "./dto/set-location.dto";
import { LogoutDto } from "./dto/logout.dto";
import { FcmTokenRepository } from "./repositories/fcm_token.repository";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UserEditProfileDTO } from "./dto/edit-profile.dto";
import { EditDrivingDetailsDto } from "./dto/edit-driving-details.dto";
import { HostService } from "../host/host.service";
import { RegisterDTO } from "src/modules/core/auth/dto/register.dto";
import { JwtUserService } from "src/modules/core/jwt/services/jwt-user.service";
import { OrdersDto } from "./dto/my-orders.dto";
import { BookingEntity } from "../booking/entities/booking.entity";
import { BookingRepository } from "../booking/repositories/booking.repository";
import { StripeService } from "src/modules/stripe/stripe.service";
import { NotificationService } from "../notification/notification.service";
import { Coordinates } from "src/types/common.type";
import { SetNotificationPreference } from "./dto/notification-preference";
type SuccessResponse<T> = {
    message: string;
    data: T;
};
export declare class UserService {
    private readonly userRepository;
    private readonly fcmTokenRepository;
    private readonly bookingRepository;
    private readonly hostService;
    private readonly jwtService;
    private readonly stripeService;
    private readonly notificationService;
    constructor(userRepository: UserRepository, fcmTokenRepository: FcmTokenRepository, bookingRepository: BookingRepository, hostService: HostService, jwtService: JwtUserService, stripeService: StripeService, notificationService: NotificationService);
    getUserFromDB({ where, select, relations, }: {
        where?: FindOptionsWhere<UserEntity>;
        select?: FindOptionsSelect<UserEntity>;
        relations?: FindOptionsRelations<UserEntity>;
    }): Promise<UserEntity>;
    updateUser({ data, where, relations, select, }: {
        data: Partial<UserEntity>;
        where: FindOptionsWhere<UserEntity>;
        relations?: FindOptionsRelations<UserEntity>;
        select?: FindOptionsSelect<UserEntity>;
    }): Promise<UserEntity>;
    create(user: Partial<UserEntity>): Promise<UserEntity>;
    register({ email, password, first_name, last_name, phone_number, user_type, }: RegisterDTO): Promise<{
        user: UserEntity;
        token: string;
        message: string;
    }>;
    setPersonalDetails(user: UserEntity, { profile_picture, date_of_birth, emergency_contact, id_card_front, id_card_back, address, city, country, user_type, }: PersonalDetailsDto): Promise<SuccessResponse<Partial<UserEntity>>>;
    setDrivingDetails({ expiry_date, license_image, license_number, user_type, }: DrivingDetailsDto, user: UserEntity): Promise<{
        message: string;
        user: UserEntity;
        isVerificationPending: boolean;
        stripeLink: string | null;
    }>;
    convertPointToCoordinates(user: UserEntity): Promise<Coordinates | null>;
    setLocation(user: UserEntity, { location }: LocationDto): Promise<{
        message: string;
        user: Partial<UserEntity>;
    }>;
    addFcmToken(token: string, userId: number): Promise<{
        message: string;
    }>;
    removeFcmToken(token: string, userId: number): Promise<void>;
    logout({ fcm_token, id }: LogoutDto): Promise<{
        message: string;
    }>;
    getUserFcmTokens(user_id: number): Promise<string[]>;
    changePassword(loggedInUser: UserEntity, { old_password, new_password }: ChangePasswordDto): Promise<{
        message: string;
    }>;
    editUserProfile(loggedInUser: UserEntity, { first_name, last_name, phone_number, profile_picture, address, city, country, date_of_birth, emergency_contact, }: UserEditProfileDTO): Promise<{
        message: string;
        user: Partial<UserEntity>;
    }>;
    editDrivingDetails(loggedInUser: UserEntity, { expiry_date }: EditDrivingDetailsDto): Promise<{
        message: string;
        user: Partial<UserEntity>;
    }>;
    myOrders(user: Partial<UserEntity>, { skip, take, status }: OrdersDto): Promise<{
        orders: BookingEntity[];
        hasMore: boolean;
    }>;
    ordersForMyCars(user: Partial<UserEntity>, { skip, take, status }: OrdersDto): Promise<{
        orders: BookingEntity[];
        hasMore: boolean;
    }>;
    validateUserFromToken(token: string): Promise<UserEntity>;
    updateUserNotificationPreference(user: UserEntity, { preference }: SetNotificationPreference): Promise<{
        message: string;
        user: UserEntity;
    }>;
}
export {};
