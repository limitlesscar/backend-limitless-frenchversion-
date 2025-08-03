import { AbstractEntity } from "src/modules/database/abstract.entity";
import { ChatType } from "../enums/chat-type.enum";
import { ChatEntity } from "./chat.entity";
import { UserEntity } from "../../user/entities/user.entity";
export declare class UserChatsEntity extends AbstractEntity {
    chat_type: ChatType;
    chat: ChatEntity;
    user: UserEntity;
}
