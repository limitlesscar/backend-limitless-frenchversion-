import { PaginationDto } from "src/types/pagination/common.dto";
import { ChatType } from "../enums/chat-type.enum";
export declare class FetchUserChatsDto extends PaginationDto {
    chat_type: ChatType;
    search: string;
}
