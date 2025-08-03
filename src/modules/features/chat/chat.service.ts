import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ChatRepository } from "./repositories/chat.repository";
import { UserChatRepository } from "./repositories/user_chat.repository";
import { ChatMessageRepository } from "./repositories/chat_message.repository";
import { ChatType } from "./enums/chat-type.enum";
import { UserService } from "../user/user.service";
import { throwHttpException } from "src/utils/app/httpException";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { HttpStatusCode } from "axios";
import { ChatEntity } from "./entities/chat.entity";
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
  ILike,
  MoreThan,
  Equal,
  IsNull,
  Not,
  Brackets,
} from "typeorm";
import { ChatMessageEntity } from "./entities/chat_message.entity";
import { UserEntity } from "../user/entities/user.entity";
import { FetchUserChatsDto } from "./dto/get-user-chats.dto";
import { PaginationDto } from "src/types/pagination/common.dto";

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userChatRepository: UserChatRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  getChatFromDB({
    where,
    select,
    relations,
    withDeleted,
  }: {
    where?: FindOptionsWhere<ChatEntity>;
    select?: FindOptionsSelect<ChatEntity>;
    relations?: FindOptionsRelations<ChatEntity>;
    withDeleted?: boolean;
  }): Promise<ChatEntity> {
    return this.chatRepository.findOne({
      where,
      select,
      relations,
      withDeleted,
    });
  }
  async findChatByIdWithBuilder(
    chat_id: number | null,
  ): Promise<ChatEntity | null> {
    if (!chat_id) {
      return null;
    }
    return await this.chatRepository.findOne({
      where: { id: chat_id },
      relations: {
        user_chat: {
          user: true,
        },
      },
      withDeleted: true,
    });
    // return await this.chatRepository
    //   .createQueryBuilder("chat")
    //   .withDeleted()
    //   .leftJoinAndSelect("chat.user_chat", "user_chat")
    //   .leftJoinAndSelect("user_chat.user", "user")
    //   .where("chat.id = :chat_id", { chat_id })
    //   .getOne();
  }

  async findChatBetweenUsers(
    sender_id: number,
    receiver_id: number,
    chat_id: number,
    chat_type: ChatType,
  ): Promise<ChatEntity> {
    const chat_by_id = await this.findChatByIdWithBuilder(chat_id);
    const sender = await this.userService.getUserFromDB({
      where: { id: sender_id },
    });
    const receiver = await this.userService.getUserFromDB({
      where: { id: receiver_id },
    });
    if (!sender || !receiver) {
      throwHttpException(
        [ErrorMessages.USER_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    let chat_by_participants: ChatEntity;
    if (!chat_by_id) {
      chat_by_participants = await this.findChatByParticipantsAndType(
        sender_id,
        receiver_id,
        chat_type,
      );
    }

    if (!chat_by_id && !chat_by_participants) {
      const created_chat = this.chatRepository.create();
      const savedChat = await this.chatRepository.save(created_chat);

      const user_one_chat = this.userChatRepository.create({
        user: sender,
        chat: savedChat,
        chat_type,
      });
      const user_two_chat = this.userChatRepository.create({
        user: receiver,
        chat: savedChat,
        chat_type:
          chat_type === ChatType.AS_CUSTOMER
            ? ChatType.AS_HOST
            : ChatType.AS_CUSTOMER,
      });
      // created_chat.user_chat.push(user_one_chat);
      // created_chat.user_chat.push(user_two_chat);
      // user_one_chat.chat = created_chat;
      // user_two_chat.chat = created_chat;
      const [chat_one, chat_two] = await Promise.all([
        this.userChatRepository.save(user_one_chat),
        this.userChatRepository.save(user_two_chat),
      ]);
      const completeChat = await this.chatRepository.findOne({
        where: { id: savedChat.id },
        relations: { user_chat: { user: true } },
      });

      if (!completeChat || completeChat.user_chat?.length !== 2) {
        throwHttpException(
          [ErrorMessages.INVALID_CHAT_STATE],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }

      return completeChat;
    }
    if (chat_by_participants) {
      return chat_by_participants;
    }

    const user_chat_user_one_id = chat_by_id.user_chat[0]?.user?.id;
    const user_chat_user_two_id = chat_by_id.user_chat[1]?.user?.id;

    if (
      (user_chat_user_one_id === sender.id ||
        user_chat_user_two_id === sender.id) &&
      (user_chat_user_one_id === receiver.id ||
        user_chat_user_two_id === receiver.id)
    ) {
      if (
        user_chat_user_one_id === sender.id &&
        chat_by_id.user_chat[0].chat_type === chat_type
      ) {
        return chat_by_id;
      } else if (
        user_chat_user_two_id === sender.id &&
        chat_by_id.user_chat[1].chat_type === chat_type
      ) {
        return chat_by_id;
      }
    } else {
      throwHttpException(
        [ErrorMessages.CHAT_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async createChatMessage(
    message: string,
    chat_id: number,
    sender_id: number,
  ): Promise<Partial<ChatMessageEntity>> {
    const chat = await this.getChatFromDB({ where: { id: chat_id } });
    const sender = await this.userService.getUserFromDB({
      where: { id: sender_id },
    });
    const created = this.chatMessageRepository.create({
      chat,
      sender,
      message,
    });
    const saved = await this.chatMessageRepository.save(created);
    return await this.chatMessageRepository.findOne({
      where: { id: saved.id },
      select: {
        id: true,
        message: true,
        createdAt: true,
        sender: { id: true, profile_picture: true, full_name: true },
        chat: { id: true },
      },
      relations: { sender: true, chat: true },
    });
  }
  async canChat(sender_id: number, chat: ChatEntity): Promise<boolean> {
    return chat.user_chat?.some(
      (user_chat) => user_chat?.user?.id === sender_id,
    );
  }
  async findChatByParticipantsAndType(
    sender_id: number,
    receiver_id: number,
    chat_type: ChatType,
  ): Promise<ChatEntity> {
    const chat = await this.chatRepository
      .createQueryBuilder("chat")
      .withDeleted()
      .leftJoinAndSelect("chat.user_chat", "user_chat")
      .withDeleted()
      .leftJoinAndSelect("user_chat.user", "user")
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("c.id")
          .from(ChatEntity, "c")
          .withDeleted()
          .leftJoin("c.user_chat", "uc1")
          .withDeleted()
          .leftJoin("c.user_chat", "uc2")
          .withDeleted()
          .where("uc1.user_id = :sender_id")
          .andWhere("uc2.user_id = :receiver_id")
          .andWhere("uc1.chat_type = :chat_type")
          .getQuery();
        return "chat.id IN " + subQuery;
      })
      .setParameters({
        sender_id,
        receiver_id,
        chat_type,
      })
      .getOne();

    return chat;
  }
  // async fetchChatBetweenTwoUsers(
  //   user_one_id: number,
  //   user_two_id: number,
  //   chat_type: ChatType
  // ): Promise<ChatEntity | null> {
  //   const chat = await this.chatRepository
  //     .createQueryBuilder("chat")
  //     .innerJoin("chat.user_chat", "user_chat")
  //     .leftJoin("user_chat.user", "user")
  //     .where(
  //       `("user".id = :user_one_id AND user_chat.chat_type = :chat_type)
  //         OR ("user".id = :user_two_id AND user_chat.chat_type = :opposite_chat_type)`,
  //       {
  //         user_one_id,
  //         user_two_id,
  //         chat_type,
  //         opposite_chat_type:
  //           chat_type === ChatType.AS_CUSTOMER
  //             ? ChatType.AS_HOST
  //             : ChatType.AS_CUSTOMER,
  //       }
  //     )
  //     .having("COUNT(user_chat.id) = 2")
  //     .groupBy("chat.id")
  //     .getOne();

  //   return chat;
  // }
  async getAllChats(
    { chat_type, skip, take, search }: FetchUserChatsDto,
    user: UserEntity,
  ): Promise<{
    chats: object;
    hasMore: boolean;
  }> {
    const chat = this.chatRepository
      .createQueryBuilder("chat")
      .withDeleted()
      .leftJoinAndSelect(
        "chat.user_chat",
        "user_chat",
        "user_chat.chat_id = chat.id",
      )
      .withDeleted()
      .leftJoinAndSelect("user_chat.user", "chat_users")
      .leftJoinAndSelect(
        "chat.messages",
        "message",
        `message.id IN (SELECT latest_message.id FROM chat_message latest_message WHERE latest_message.chat_id = chat.id ORDER BY latest_message."createdAt" DESC LIMIT 1)`,
      )
      .leftJoinAndSelect("message.sender", "sender")
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("uc.chat_id")
          .from("user_chat", "uc")
          .withDeleted()
          .where("uc.user_id = :userId")
          .andWhere("uc.chat_type = :chat_type")
          .andWhere(
            new Brackets((qb) => {
              qb.where("uc.deletedAt IS NULL") // Show chats that aren't deleted
                .orWhere(
                  `EXISTS (SELECT 1 FROM chat_message m WHERE m.chat_id = uc.chat_id AND m."createdAt" > uc.deletedAt)`,
                );
            }),
          )
          .getQuery();
        return "chat.id IN " + subQuery;
      })
      .setParameter("userId", user.id)
      .setParameter("chat_type", chat_type)
      .skip(skip)
      .take(take)
      .orderBy("message.createdAt", "DESC");

    if (search) {
      search = search.trim();
      chat
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select("other_uc.chat_id")
            .from("user_chat", "other_uc")
            .withDeleted()
            .leftJoin("user", "other_user", "other_user.id = other_uc.user_id")
            .where("other_uc.user_id != :userId")
            .andWhere((qb2) => {
              const searchConditions = qb2
                .subQuery()
                .select("u.id")
                .from("user", "u")
                .where("u.id = other_uc.user_id")
                .andWhere(
                  "(LOWER(u.full_name) ILIKE LOWER(:search) OR " +
                    "LOWER(u.first_name) ILIKE LOWER(:search) OR " +
                    "LOWER(u.last_name) ILIKE LOWER(:search))",
                )
                .getQuery();
              return "other_user.id IN " + searchConditions;
            })
            .getQuery();
          return "chat.id IN " + subQuery;
        })
        .setParameter("search", `%${search}%`);
    }

    const [chats, total] = await chat.getManyAndCount();
    const hasMore = total > skip + chats.length;
    const processedChats = chats.map((chat) => {
      const otherUser = chat.user_chat.find(
        (uc) => uc.user.id !== user.id,
      )?.user;

      const lastMessage = chat.messages[0];

      return {
        chat_id: chat.id,
        chat_type: chat_type,
        otherUser: {
          id: otherUser?.id,
          full_name: otherUser?.full_name,
          profile_picture: otherUser?.profile_picture,
        },
        message: lastMessage?.message,
      };
    });
    const filtered = processedChats?.filter(
      (chat) => chat?.message?.length > 0,
    );
    return {
      chats: filtered,
      hasMore,
    };
  }
  async fetchMessagesOfChat(
    chat_id: number,
    user: Partial<UserEntity>,
    { skip, take }: PaginationDto,
  ): Promise<{ messages: ChatMessageEntity[]; hasMore: boolean }> {
    const deleteExist = await this.userChatRepository.findOne({
      where: {
        chat: { id: chat_id },
        user: { id: user?.id },
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    });
    const [messages, total] = await this.chatMessageRepository.findAndCount({
      where: {
        chat: { id: chat_id },
        createdAt: deleteExist ? MoreThan(deleteExist.deletedAt) : null,
      },
      skip,
      take,
      select: { sender: { id: true, full_name: true, profile_picture: true } },
      relations: { sender: true },
      order: {
        createdAt: "DESC",
      },
    });

    const hasMore = total > skip + messages.length;
    return {
      messages,
      hasMore,
    };
  }
  async deleteChat(
    chat_id: number,
    user: Partial<UserEntity>,
  ): Promise<{ message: string; deletedChat: ChatEntity }> {
    try {
      const chat = await this.userChatRepository.findOne({
        where: { chat: { id: chat_id }, user: { id: user?.id } },
        withDeleted: true,
      });
      if (!chat) {
        throwHttpException(
          [`Chat doesnot exist`],
          HttpStatusCode.NotFound,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!chat.deletedAt) {
        const deleted = await this.userChatRepository.softDelete(chat.id);
        if (deleted.affected > 0) {
          return {
            message: "Chat deleted successfully",
            deletedChat: await this.chatRepository.findOne({
              where: { id: chat_id },
            }),
          };
        }
      }
      await this.userChatRepository.update(
        { id: chat.id },
        { deletedAt: new Date(Date.now()) },
      );
      return {
        message: "Chat deleted successfully",
        deletedChat: await this.chatRepository.findOne({
          where: { id: chat_id },
        }),
      };
    } catch (error) {
      console.log(error);
      throwHttpException(
        error.response?.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
