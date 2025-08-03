import { ISendAdminNotification, NotificationInterface } from "./interface/notification.interface";
import { NotificationEntity } from "./entities/notification.entity";
import { NotificationRepository } from "./repositories/notification.repository";
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, FindOptionsOrder } from "typeorm";
import { FcmTokenRepository } from "../user/repositories/fcm_token.repository";
export declare class NotificationService {
    private notificationRepository;
    private readonly fcmTokenRepository;
    constructor(notificationRepository: NotificationRepository, fcmTokenRepository: FcmTokenRepository);
    create(notification: Partial<NotificationEntity>): Promise<NotificationEntity>;
    getAllNotificationsFromDB({ where, select, relations, order, skip, take, }: {
        where?: FindOptionsWhere<NotificationEntity>;
        select?: FindOptionsSelect<NotificationEntity>;
        relations?: FindOptionsRelations<NotificationEntity>;
        order?: FindOptionsOrder<NotificationEntity>;
        skip?: number;
        take?: number;
    }): Promise<[NotificationEntity[], number]>;
    removeUregisteredTokens(tokens: string[]): Promise<void>;
    sendNotification(notification: NotificationInterface): Promise<void>;
    sendAdminNotification({ fcmTokens, message }: ISendAdminNotification): Promise<any>;
}
