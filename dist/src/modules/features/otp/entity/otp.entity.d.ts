import { UserEntity } from "../../user/entities/user.entity";
export declare class OTPTableEntity {
    id: number;
    email: string;
    otp: number;
    type: string;
    is_used: boolean;
    is_expired: boolean;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
    user: UserEntity;
}
