import { AbstractEntity } from "src/modules/database/abstract.entity";
import { ChatEntity } from "./chat.entity";
import { UserEntity } from "../../user/entities/user.entity";
export declare class ChatMessageEntity extends AbstractEntity {
    message: string;
    chat: ChatEntity;
    sender: UserEntity;
}
