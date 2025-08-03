import { NotificationEntity } from "../entities/notification.entity";
export interface NotificationInterface {
    fcmTokens: string[];
    data: Partial<NotificationEntity>;
}
export interface ISendAdminNotification {
    fcmTokens: string[];
    message: string;
}
