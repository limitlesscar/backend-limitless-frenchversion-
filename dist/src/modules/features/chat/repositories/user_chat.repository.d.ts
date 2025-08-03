import { Repository } from "typeorm";
import { UserChatsEntity } from "../entities/user_chat.entity";
export declare class UserChatRepository extends Repository<UserChatsEntity> {
    constructor(userChatRepository: Repository<UserChatsEntity>);
}
