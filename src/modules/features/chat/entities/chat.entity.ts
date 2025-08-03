import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Entity, ManyToOne, OneToMany } from "typeorm";
import { UserChatsEntity } from "./user_chat.entity";
import { ChatMessageEntity } from "./chat_message.entity";
@Entity("chat")
export class ChatEntity extends AbstractEntity {
  // RELATIONS

  // One-to-Many with user chats entity (A chat can have multiple user_chat entries)
  @OneToMany(() => UserChatsEntity, (user_chat) => user_chat.chat)
  user_chat: UserChatsEntity[];

  // One-to-Many with chat messages entity (A chat can have multiple messages)
  @OneToMany(() => ChatMessageEntity, (messages) => messages.chat)
  messages: ChatMessageEntity[];
}
