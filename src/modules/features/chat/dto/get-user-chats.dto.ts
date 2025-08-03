import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "src/types/pagination/common.dto";
import { ChatType } from "../enums/chat-type.enum";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class FetchUserChatsDto extends PaginationDto {
  @ApiProperty({
    name: "chat_type",
    enum: [ChatType.AS_CUSTOMER, ChatType.AS_HOST],
  })
  @IsEnum(ChatType)
  @IsNotEmpty({ message: "Chat type cannot be empty" })
  chat_type: ChatType;
  @ApiProperty({
    name: "search",
    example: "Usaid",
    description: "search by name",
    required: false,
  })
  @IsOptional()
  search: string;
}
