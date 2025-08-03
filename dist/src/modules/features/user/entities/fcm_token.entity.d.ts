import { AbstractEntity } from "src/modules/database/abstract.entity";
import { UserEntity } from "./user.entity";
export declare class FcmTokenEntity extends AbstractEntity {
    token: string;
    user: UserEntity;
}
