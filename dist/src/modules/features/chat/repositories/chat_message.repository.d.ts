import { Repository } from "typeorm";
import { ChatMessageEntity } from "../entities/chat_message.entity";
export declare class ChatMessageRepository extends Repository<ChatMessageEntity> {
    constructor(chatMessageRepository: Repository<ChatMessageEntity>);
}
