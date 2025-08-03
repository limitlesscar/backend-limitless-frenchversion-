import { Repository } from "typeorm";
import { LegalDocumentEntity } from "../entities/legal_document.entity";
export declare class LegalDocumentRepository extends Repository<LegalDocumentEntity> {
    constructor(legal_document: Repository<LegalDocumentEntity>);
}
