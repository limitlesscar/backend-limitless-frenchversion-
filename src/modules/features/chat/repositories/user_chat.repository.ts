import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserChatsEntity } from "../entities/user_chat.entity";

export class UserChatRepository extends Repository<UserChatsEntity> {
  constructor(
    @InjectRepository(UserChatsEntity)
    userChatRepository: Repository<UserChatsEntity>,
  ) {
    super(
      userChatRepository.target,
      userChatRepository.manager,
      userChatRepository.queryRunner,
    );
  }
}
