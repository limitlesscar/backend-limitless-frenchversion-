import { ChatService } from "./chat.service";
import { CustomRequest } from "src/types/common.type";
import { FetchUserChatsDto } from "./dto/get-user-chats.dto";
import { PaginationDto } from "src/types/pagination/common.dto";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    fetchUserChats(fetchUserChatsDto: FetchUserChatsDto, { user }: CustomRequest): Promise<{
        chats: object;
        hasMore: boolean;
    }>;
    fetchMessages(id: number, paginationDto: PaginationDto, { user }: CustomRequest): Promise<{
        messages: import("./entities/chat_message.entity").ChatMessageEntity[];
        hasMore: boolean;
    }>;
    delete(id: number, { user }: CustomRequest): Promise<{
        message: string;
        deletedChat: import("./entities/chat.entity").ChatEntity;
    }>;
}
