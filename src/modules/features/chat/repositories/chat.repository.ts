import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../entities/chat.entity";

export class ChatRepository extends Repository<ChatEntity> {
  constructor(
    @InjectRepository(ChatEntity)
    chatRepository: Repository<ChatEntity>,
  ) {
    super(
      chatRepository.target,
      chatRepository.manager,
      chatRepository.queryRunner,
    );
  }
}
