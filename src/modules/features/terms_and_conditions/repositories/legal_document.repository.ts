import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LegalDocumentEntity } from "../entities/legal_document.entity";

@Injectable()
export class LegalDocumentRepository extends Repository<LegalDocumentEntity> {
  constructor(
    @InjectRepository(LegalDocumentEntity)
    legal_document: Repository<LegalDocumentEntity>,
  ) {
    super(
      legal_document.target,
      legal_document.manager,
      legal_document.queryRunner,
    );
  }
}
