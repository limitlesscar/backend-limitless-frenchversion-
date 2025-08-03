"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const chat_repository_1 = require("./repositories/chat.repository");
const user_chat_repository_1 = require("./repositories/user_chat.repository");
const chat_message_repository_1 = require("./repositories/chat_message.repository");
const chat_type_enum_1 = require("./enums/chat-type.enum");
const user_service_1 = require("../user/user.service");
const httpException_1 = require("../../../utils/app/httpException");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
const axios_1 = require("axios");
const chat_entity_1 = require("./entities/chat.entity");
const typeorm_1 = require("typeorm");
let ChatService = class ChatService {
    constructor(chatRepository, userChatRepository, chatMessageRepository, userService) {
        this.chatRepository = chatRepository;
        this.userChatRepository = userChatRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userService = userService;
    }
    getChatFromDB({ where, select, relations, withDeleted, }) {
        return this.chatRepository.findOne({
            where,
            select,
            relations,
            withDeleted,
        });
    }
    async findChatByIdWithBuilder(chat_id) {
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
    }
    async findChatBetweenUsers(sender_id, receiver_id, chat_id, chat_type) {
        const chat_by_id = await this.findChatByIdWithBuilder(chat_id);
        const sender = await this.userService.getUserFromDB({
            where: { id: sender_id },
        });
        const receiver = await this.userService.getUserFromDB({
            where: { id: receiver_id },
        });
        if (!sender || !receiver) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.USER_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        let chat_by_participants;
        if (!chat_by_id) {
            chat_by_participants = await this.findChatByParticipantsAndType(sender_id, receiver_id, chat_type);
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
                chat_type: chat_type === chat_type_enum_1.ChatType.AS_CUSTOMER
                    ? chat_type_enum_1.ChatType.AS_HOST
                    : chat_type_enum_1.ChatType.AS_CUSTOMER,
            });
            const [chat_one, chat_two] = await Promise.all([
                this.userChatRepository.save(user_one_chat),
                this.userChatRepository.save(user_two_chat),
            ]);
            const completeChat = await this.chatRepository.findOne({
                where: { id: savedChat.id },
                relations: { user_chat: { user: true } },
            });
            if (!completeChat || completeChat.user_chat?.length !== 2) {
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_CHAT_STATE], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            return completeChat;
        }
        if (chat_by_participants) {
            return chat_by_participants;
        }
        const user_chat_user_one_id = chat_by_id.user_chat[0]?.user?.id;
        const user_chat_user_two_id = chat_by_id.user_chat[1]?.user?.id;
        if ((user_chat_user_one_id === sender.id ||
            user_chat_user_two_id === sender.id) &&
            (user_chat_user_one_id === receiver.id ||
                user_chat_user_two_id === receiver.id)) {
            if (user_chat_user_one_id === sender.id &&
                chat_by_id.user_chat[0].chat_type === chat_type) {
                return chat_by_id;
            }
            else if (user_chat_user_two_id === sender.id &&
                chat_by_id.user_chat[1].chat_type === chat_type) {
                return chat_by_id;
            }
        }
        else {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CHAT_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async createChatMessage(message, chat_id, sender_id) {
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
    async canChat(sender_id, chat) {
        return chat.user_chat?.some((user_chat) => user_chat?.user?.id === sender_id);
    }
    async findChatByParticipantsAndType(sender_id, receiver_id, chat_type) {
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
                .from(chat_entity_1.ChatEntity, "c")
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
    async getAllChats({ chat_type, skip, take, search }, user) {
        const chat = this.chatRepository
            .createQueryBuilder("chat")
            .withDeleted()
            .leftJoinAndSelect("chat.user_chat", "user_chat", "user_chat.chat_id = chat.id")
            .withDeleted()
            .leftJoinAndSelect("user_chat.user", "chat_users")
            .leftJoinAndSelect("chat.messages", "message", `message.id IN (SELECT latest_message.id FROM chat_message latest_message WHERE latest_message.chat_id = chat.id ORDER BY latest_message."createdAt" DESC LIMIT 1)`)
            .leftJoinAndSelect("message.sender", "sender")
            .where((qb) => {
            const subQuery = qb
                .subQuery()
                .select("uc.chat_id")
                .from("user_chat", "uc")
                .withDeleted()
                .where("uc.user_id = :userId")
                .andWhere("uc.chat_type = :chat_type")
                .andWhere(new typeorm_1.Brackets((qb) => {
                qb.where("uc.deletedAt IS NULL")
                    .orWhere(`EXISTS (SELECT 1 FROM chat_message m WHERE m.chat_id = uc.chat_id AND m."createdAt" > uc.deletedAt)`);
            }))
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
                        .andWhere("(LOWER(u.full_name) ILIKE LOWER(:search) OR " +
                        "LOWER(u.first_name) ILIKE LOWER(:search) OR " +
                        "LOWER(u.last_name) ILIKE LOWER(:search))")
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
            const otherUser = chat.user_chat.find((uc) => uc.user.id !== user.id)?.user;
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
        const filtered = processedChats?.filter((chat) => chat?.message?.length > 0);
        return {
            chats: filtered,
            hasMore,
        };
    }
    async fetchMessagesOfChat(chat_id, user, { skip, take }) {
        const deleteExist = await this.userChatRepository.findOne({
            where: {
                chat: { id: chat_id },
                user: { id: user?.id },
                deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            },
            withDeleted: true,
        });
        const [messages, total] = await this.chatMessageRepository.findAndCount({
            where: {
                chat: { id: chat_id },
                createdAt: deleteExist ? (0, typeorm_1.MoreThan)(deleteExist.deletedAt) : null,
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
    async deleteChat(chat_id, user) {
        try {
            const chat = await this.userChatRepository.findOne({
                where: { chat: { id: chat_id }, user: { id: user?.id } },
                withDeleted: true,
            });
            if (!chat) {
                (0, httpException_1.throwHttpException)([`Chat doesnot exist`], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
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
            await this.userChatRepository.update({ id: chat.id }, { deletedAt: new Date(Date.now()) });
            return {
                message: "Chat deleted successfully",
                deletedChat: await this.chatRepository.findOne({
                    where: { id: chat_id },
                }),
            };
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error.response?.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository,
        user_chat_repository_1.UserChatRepository,
        chat_message_repository_1.ChatMessageRepository,
        user_service_1.UserService])
], ChatService);
//# sourceMappingURL=chat.service.js.map