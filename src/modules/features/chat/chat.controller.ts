import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtUserGuard } from "src/modules/core/auth/guards/user.guard";
import { AuthorizationHeader, CustomRequest } from "src/types/common.type";
import { FetchUserChatsDto } from "./dto/get-user-chats.dto";
import { PaginationDto } from "src/types/pagination/common.dto";

@Controller("chat")
@ApiTags("Chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Fetch all user chats by chat type and search" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("")
  async fetchUserChats(
    @Query() fetchUserChatsDto: FetchUserChatsDto,
    @Req() { user }: CustomRequest,
  ) {
    return await this.chatService.getAllChats(fetchUserChatsDto, user);
  }
  @ApiOperation({ summary: "Fetch all chat messages of a chat" })
  @UseGuards(JwtUserGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("/:id/messages")
  async fetchMessages(
    @Param("id", ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
    @Req() { user }: CustomRequest,
  ) {
    return await this.chatService.fetchMessagesOfChat(id, user, paginationDto);
  }
  @ApiOperation({ summary: "Delete Chat" })
  @UseGuards(JwtUserGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Delete("/:id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
    @Req() { user }: CustomRequest,
  ) {
    return await this.chatService.deleteChat(id, user);
  }
}
