import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ChatEntity } from "./chat.entity";
import { UserEntity } from "../../user/entities/user.entity";
@Entity("chat_message")
export class ChatMessageEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  message: string;

  //   Relations
  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  @JoinColumn({ name: "chat_id", referencedColumnName: "id" })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, (sender) => sender.messages)
  @JoinColumn({ name: "sender_id", referencedColumnName: "id" })
  sender: UserEntity;
}
