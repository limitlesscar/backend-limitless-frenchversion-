import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity("admin")
export class AdminEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  email: string;
  @Column({ type: "varchar" })
  password: string;
}
