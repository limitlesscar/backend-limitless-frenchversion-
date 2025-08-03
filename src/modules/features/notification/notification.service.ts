import { Injectable } from "@nestjs/common";
import {
  ISendAdminNotification,
  NotificationInterface,
} from "./interface/notification.interface";
import * as admin from "firebase-admin";
import { NotificationEntity } from "./entities/notification.entity";
import { NotificationRepository } from "./repositories/notification.repository";
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
  FindOptionsOrder,
  In,
} from "typeorm";
import { USER_NOTIFICATION_PREFERENCE } from "../user/enums/notification-preference";
import { FcmTokenRepository } from "../user/repositories/fcm_token.repository";

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private readonly fcmTokenRepository: FcmTokenRepository,
  ) {}
  //   ================================ CREATE NOTIFICATION==========================
  async create(
    notification: Partial<NotificationEntity>,
  ): Promise<NotificationEntity> {
    const created = this.notificationRepository.create({ ...notification });
    const saved = await this.notificationRepository.save(created);
    return await this.notificationRepository.findOne({
      where: { id: saved.id },
      relations: { user: true },
      select: {
        user: {
          id: true,
          notification_preference: true,
          profile_picture: true,
        },
      },
    });
  }
  // ============================================= GET ALL USER NOTIFICATIONS =============================================

  async getAllNotificationsFromDB({
    where,
    select,
    relations,
    order,
    skip,
    take,
  }: {
    where?: FindOptionsWhere<NotificationEntity>;
    select?: FindOptionsSelect<NotificationEntity>;
    relations?: FindOptionsRelations<NotificationEntity>;
    order?: FindOptionsOrder<NotificationEntity>;
    skip?: number;
    take?: number;
  }): Promise<[NotificationEntity[], number]> {
    return await this.notificationRepository.findAndCount({
      where,
      select,
      relations,
      order,
      skip,
      take,
    });
  }
  async removeUregisteredTokens(tokens: string[]) {
    if (!tokens?.length) return;
    const tokensToRemove = await this.fcmTokenRepository.find({
      where: { token: In(tokens) },
    });
    await this.fcmTokenRepository.remove(tokensToRemove);
  }

  //   ================================ SEND PUSH NOTIFICATION WITH INAPP NOTIFICATION CREATION===============
  async sendNotification(notification: NotificationInterface) {
    const unregisteredTokens = [];
    try {
      const { data, fcmTokens } = notification;
      await this.create(data);
      if (
        data?.user?.notification_preference ===
        USER_NOTIFICATION_PREFERENCE.IN_APP
      ) {
        console.log(
          "Not sending notification as user has in app notification preference",
        );
        return;
      }

      if (!fcmTokens?.length) return;

      const message = {
        data: {
          body: data?.message,
          navigateTo: data?.navigate_to || "",
          resource_id: data?.resource_id || "",
          profile_picture: data?.user?.profile_picture || "",
        },
        notification: {
          body: data?.message,
        },
        tokens: fcmTokens,
      };

      const res = await admin.messaging().sendEachForMulticast(message);
      res?.responses?.forEach((response, index) => {
        if (
          response.error?.code === "messaging/registration-token-not-registered"
        ) {
          unregisteredTokens.push(fcmTokens[index]);
        }
      });
      await this.removeUregisteredTokens(unregisteredTokens);
    } catch (error) {
      console.error(
        `Error in FirebaseService#sendNotification ${JSON.stringify({ error, notification })}`,
        error?.stack,
      );
    }
  }

  // if (unregisteredTokens.length > 0) {
  //   await this.removeUnregisteredTokens({ unregisteredTokens });
  // }

  async sendAdminNotification({ fcmTokens, message }: ISendAdminNotification) {
    try {
      if (!fcmTokens?.length) return;

      const body = {
        data: {
          body: message,
        },
        notification: {
          body: message,
        },
        tokens: fcmTokens,
      };

      return admin.messaging().sendEachForMulticast(body);
    } catch (error) {
      console.error(
        `Error in FirebaseService#sendNotification ${JSON.stringify({ error })}`,
        error?.stack,
      );
    }
  }
  // formatNotifications(
  //   notifications: NotificationEntity[],
  //   timeZone?: string
  // ): {
  //   date: string;
  //   data: any;
  // }[] {
  //   const formatDate = (dateString: Date) => {
  //     const date = new Date(dateString);
  //     const today = new Date();

  //     if (date.toDateString() === today.toDateString()) {
  //       return "Today";
  //     }

  //     // Format other dates as 'DD MMM'
  //     return date.toLocaleDateString("en-US", {
  //       day: "numeric",
  //       month: "short",
  //     });
  //   };

  //   // Helper function to format time
  //   const formatTime = (dateString: Date) => {
  //     const date = new Date(dateString);

  //     const timeZoneOffset = date.getTimezoneOffset() / 60; // Get the current local timezone offset in hours
  //     const localDate = new Date(
  //       date.getTime() + timeZoneOffset * 60 * 60 * 1000
  //     );
  //     // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  //     return localDate.toLocaleTimeString("en-US", {
  //       hour: "numeric",
  //       minute: "2-digit",
  //       hour12: true,
  //       timeZone: timeZone || "Asia/Karachi",
  //     });
  //   };

  //   const grouped = notifications?.reduce((acc, notification) => {
  //     const date = formatDate(notification.createdAt);
  //     if (!acc[date]) {
  //       acc[date] = [];
  //     }

  //     acc[date].push({
  //       title: notification.message,
  //       time: formatTime(notification.createdAt),
  //     });

  //     return acc;
  //   }, {});

  //   // Convert to desired array format
  //   return Object.entries(grouped).map(([date, data]) => ({
  //     date,
  //     data,
  //   }));
  // }
}
