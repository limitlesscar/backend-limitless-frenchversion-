import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ChatType } from "../enums/chat-type.enum";
import { ChatEntity } from "./chat.entity";
import { UserEntity } from "../../user/entities/user.entity";
@Entity("user_chat")
export class UserChatsEntity extends AbstractEntity {
  @Column({ type: "enum", enum: ChatType })
  chat_type: ChatType;

  // RELATIONS
  // Many-to-One relationship with ChatEntity (Each user_chat belongs to one chat)
  @ManyToOne(() => ChatEntity, (chat) => chat.user_chat)
  @JoinColumn({ name: "chat_id", referencedColumnName: "id" })
  chat: ChatEntity;

  // Many-to-One relationship with UserEntity (Each user_chat is for a specific user)
  @ManyToOne(() => UserEntity, (user) => user.chats)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;
}
