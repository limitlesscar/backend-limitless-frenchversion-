import { USER_TYPE_ENUM } from "src/modules/features/user/enums/user-role.enum";
export declare class RegisterDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone_number: string;
    user_type: USER_TYPE_ENUM;
}
