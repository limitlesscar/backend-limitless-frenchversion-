import { USER_TYPE_ENUM } from "../enums/user-role.enum";
export declare class DrivingDetailsDto {
    user_type?: USER_TYPE_ENUM;
    license_number: string;
    expiry_date: string;
    license_image: string;
}
