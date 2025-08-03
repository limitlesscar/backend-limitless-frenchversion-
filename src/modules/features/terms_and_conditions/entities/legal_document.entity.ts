import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("legal_document")
export class LegalDocumentEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column({
    type: "enum",
    enum: ["TERMS_CONDITIONS", "PRIVACY_POLICY"],
  })
  type: string;
}
