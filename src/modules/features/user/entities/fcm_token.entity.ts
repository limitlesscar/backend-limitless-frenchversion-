import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
@Entity("fcm_token")
export class FcmTokenEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  token: string;

  // =================Relations===============
  @ManyToOne(() => UserEntity, (user) => user.fcm_token, {
    onDelete: "SET NULL",
    orphanedRowAction: "soft-delete",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;
}
