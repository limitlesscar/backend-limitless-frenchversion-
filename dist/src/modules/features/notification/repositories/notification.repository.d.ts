import { Repository } from "typeorm";
import { NotificationEntity } from "../entities/notification.entity";
export declare class NotificationRepository extends Repository<NotificationEntity> {
    constructor(notificationRepository: Repository<NotificationEntity>);
}
