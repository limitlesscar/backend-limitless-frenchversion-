import { ChatRepository } from "./repositories/chat.repository";
import { UserChatRepository } from "./repositories/user_chat.repository";
import { ChatMessageRepository } from "./repositories/chat_message.repository";
import { ChatType } from "./enums/chat-type.enum";
import { UserService } from "../user/user.service";
import { ChatEntity } from "./entities/chat.entity";
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations } from "typeorm";
import { ChatMessageEntity } from "./entities/chat_message.entity";
import { UserEntity } from "../user/entities/user.entity";
import { FetchUserChatsDto } from "./dto/get-user-chats.dto";
import { PaginationDto } from "src/types/pagination/common.dto";
export declare class ChatService {
    private readonly chatRepository;
    private readonly userChatRepository;
    private readonly chatMessageRepository;
    private readonly userService;
    constructor(chatRepository: ChatRepository, userChatRepository: UserChatRepository, chatMessageRepository: ChatMessageRepository, userService: UserService);
    getChatFromDB({ where, select, relations, withDeleted, }: {
        where?: FindOptionsWhere<ChatEntity>;
        select?: FindOptionsSelect<ChatEntity>;
        relations?: FindOptionsRelations<ChatEntity>;
        withDeleted?: boolean;
    }): Promise<ChatEntity>;
    findChatByIdWithBuilder(chat_id: number | null): Promise<ChatEntity | null>;
    findChatBetweenUsers(sender_id: number, receiver_id: number, chat_id: number, chat_type: ChatType): Promise<ChatEntity>;
    createChatMessage(message: string, chat_id: number, sender_id: number): Promise<Partial<ChatMessageEntity>>;
    canChat(sender_id: number, chat: ChatEntity): Promise<boolean>;
    findChatByParticipantsAndType(sender_id: number, receiver_id: number, chat_type: ChatType): Promise<ChatEntity>;
    getAllChats({ chat_type, skip, take, search }: FetchUserChatsDto, user: UserEntity): Promise<{
        chats: object;
        hasMore: boolean;
    }>;
    fetchMessagesOfChat(chat_id: number, user: Partial<UserEntity>, { skip, take }: PaginationDto): Promise<{
        messages: ChatMessageEntity[];
        hasMore: boolean;
    }>;
    deleteChat(chat_id: number, user: Partial<UserEntity>): Promise<{
        message: string;
        deletedChat: ChatEntity;
    }>;
}
