import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtUserGuard } from "src/modules/core/auth/guards/user.guard";
import { AuthorizationHeader, CustomRequest } from "src/types/common.type";
import { PaginationDto } from "src/types/pagination/common.dto";

@Controller("notification")
@ApiTags("Notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  // @ApiOperation({ summary: "Send Notifications" })
  // @Post("")
  // async send(@Body() notification: SendNotificationDto) {
  //   return await this.notificationService.sendTestingNotification(notification);
  // }
  @UseGuards(JwtUserGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @ApiOperation({ summary: "Get all user notifications" })
  @Get("")
  async AllNotifications(
    @Query() { skip, take }: PaginationDto,
    @Req() { user }: CustomRequest,
  ): Promise<{ notifications: any; hasMore: boolean }> {
    const [notifications, total] =
      await this.notificationService.getAllNotificationsFromDB({
        where: { user: { id: user?.id } },
        skip,
        take,
        order: { createdAt: "DESC" },
      });
    const hasMore = total > skip + notifications.length;
    // const formatted = this.notificationService.formatNotifications(
    //   notifications,
    //   timezone
    // );
    return {
      notifications,
      hasMore,
    };
  }
}
