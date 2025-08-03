import { AbstractEntity } from "src/modules/database/abstract.entity";
import { UserEntity } from "../../user/entities/user.entity";
export declare class NotificationEntity extends AbstractEntity {
    message: string;
    navigate_to: string;
    resource_id: string;
    user: UserEntity;
}
