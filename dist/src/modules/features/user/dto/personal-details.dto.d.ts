import { USER_TYPE_ENUM } from "../enums/user-role.enum";
export declare class PersonalDetailsDto {
    user_type?: USER_TYPE_ENUM;
    profile_picture: string;
    date_of_birth: string;
    emergency_contact: string;
    id_card_front: string;
    id_card_back: string;
    country: string;
    city: string;
    address: string;
}
