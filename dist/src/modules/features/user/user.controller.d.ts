import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";
import { CustomRequest } from "src/types/common.type";
import { PersonalDetailsDto } from "./dto/personal-details.dto";
import { DrivingDetailsDto } from "./dto/driving-details.dto";
import { LocationDto } from "./dto/set-location.dto";
import { LogoutDto } from "./dto/logout.dto";
import { UserEditProfileDTO } from "./dto/edit-profile.dto";
import { EditDrivingDetailsDto } from "./dto/edit-driving-details.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { RegisterDTO } from "src/modules/core/auth/dto/register.dto";
import { OrdersDto } from "./dto/my-orders.dto";
import { BookingEntity } from "../booking/entities/booking.entity";
import { AddFcmTokenDto } from "./dto/add-fcm-token.dto";
import { SetNotificationPreference } from "./dto/notification-preference";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    whoAmI({ user }: CustomRequest): Promise<UserEntity>;
    myOrders({ user }: CustomRequest, ordersDto: OrdersDto): Promise<{
        orders: BookingEntity[];
        hasMore: boolean;
    }>;
    OrdersForMyCars({ user }: CustomRequest, ordersDto: OrdersDto): Promise<{
        orders: BookingEntity[];
        hasMore: boolean;
    }>;
    getUserById(id: number): Promise<Partial<UserEntity>>;
    register(registerDto: RegisterDTO): Promise<{
        user: UserEntity;
        token: string;
    }>;
    addFcmToken({ fcmToken }: AddFcmTokenDto, { user }: CustomRequest): Promise<{
        message: string;
    }>;
    setPersonalDetails({ user }: CustomRequest, personalDetailsDto: PersonalDetailsDto): Promise<{
        message: string;
        data: Partial<UserEntity>;
    }>;
    setDrivingDetails({ user }: CustomRequest, drivingDetailsDto: DrivingDetailsDto): Promise<{
        message: string;
        user: Partial<UserEntity>;
        isVerificationPending: boolean;
    }>;
    Logout(logoutDto: LogoutDto): Promise<{
        message: string;
    }>;
    setNotificationPreference(setNotificationPreference: SetNotificationPreference, { user }: CustomRequest): Promise<{
        message: string;
        user: UserEntity;
    }>;
    updateUserProfile({ user }: CustomRequest, userEditProfileDTO: UserEditProfileDTO): Promise<{
        message: string;
        user: Partial<UserEntity>;
    }>;
    updateDrivingDetails({ user }: CustomRequest, editDrivingDetailsDto: EditDrivingDetailsDto): Promise<{
        message: string;
        user: Partial<UserEntity>;
    }>;
    setUserLocation({ user }: CustomRequest, locationDto: LocationDto): Promise<{
        message: string;
        user: Partial<UserEntity>;
    }>;
    changePassword({ user }: CustomRequest, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
