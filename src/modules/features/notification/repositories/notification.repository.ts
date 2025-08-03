import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationEntity } from "../entities/notification.entity";

export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    notificationRepository: Repository<NotificationEntity>,
  ) {
    super(
      notificationRepository.target,
      notificationRepository.manager,
      notificationRepository.queryRunner,
    );
  }
}
