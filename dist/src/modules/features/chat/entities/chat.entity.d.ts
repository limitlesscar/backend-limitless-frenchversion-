import { AbstractEntity } from "src/modules/database/abstract.entity";
import { UserChatsEntity } from "./user_chat.entity";
import { ChatMessageEntity } from "./chat_message.entity";
export declare class ChatEntity extends AbstractEntity {
    user_chat: UserChatsEntity[];
    messages: ChatMessageEntity[];
}
