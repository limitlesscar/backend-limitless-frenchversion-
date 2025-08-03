import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMessageEntity } from "../entities/chat_message.entity";

export class ChatMessageRepository extends Repository<ChatMessageEntity> {
  constructor(
    @InjectRepository(ChatMessageEntity)
    chatMessageRepository: Repository<ChatMessageEntity>,
  ) {
    super(
      chatMessageRepository.target,
      chatMessageRepository.manager,
      chatMessageRepository.queryRunner,
    );
  }
}
