import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { ChatType } from "../../chat/enums/chat-type.enum";

export class ChatTypeDto {
  @ApiProperty({ name: "chat_type", required: false, enum: ChatType })
  @IsOptional()
  @IsEnum(ChatType)
  chat_type: ChatType;
}
