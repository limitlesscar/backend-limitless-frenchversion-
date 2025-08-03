import { NotificationService } from "./notification.service";
import { CustomRequest } from "src/types/common.type";
import { PaginationDto } from "src/types/pagination/common.dto";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    AllNotifications({ skip, take }: PaginationDto, { user }: CustomRequest): Promise<{
        notifications: any;
        hasMore: boolean;
    }>;
}
