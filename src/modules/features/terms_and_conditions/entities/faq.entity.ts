import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("FAQs")
export class FAQEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ["HOSTS", "RENTERS", "INSURANCE", "LEGAL"],
  })
  category: string;

  @Column()
  question: string;

  @Column("text")
  answer: string;
}
