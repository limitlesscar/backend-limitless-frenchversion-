import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ISendMessageDto {
  @ApiProperty({
    name: "message",
    example: "Hello this is my first chat message",
  })
  @IsNotEmpty({ message: "Message cannot be empty" })
  @IsString({ message: "Message should be of type string" })
  message: string;
  @ApiProperty({
    name: "sender_id",
    example: 1,
    description: "Id of the sender",
  })
  @IsNotEmpty({ message: "Sender Id cannot be empty" })
  @Type(() => Number)
  @IsNumber({}, { message: "Sender id should be a valid number" })
  sender_id: number;
  @ApiProperty({
    name: "chat_id",
    example: 2,
    description: "Id of the chat",
  })
  @IsNotEmpty({ message: "Chat Id cannot be empty" })
  @IsNumber({}, { message: "Chat Id should be a valid number" })
  chat_id: number;
}
