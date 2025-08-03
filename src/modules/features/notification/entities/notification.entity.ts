import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
@Entity("notification")
export class NotificationEntity extends AbstractEntity {
  @Column({ type: "varchar", nullable: true })
  message: string;
  @Column({ type: "varchar", nullable: true })
  navigate_to: string;
  @Column({ type: "varchar", nullable: true })
  resource_id: string;

  //   RELATIONS
  @ManyToOne(() => UserEntity, (user) => user.notifications, { nullable: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;
}
