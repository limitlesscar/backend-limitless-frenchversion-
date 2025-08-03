import { AbstractEntity } from "src/modules/database/abstract.entity";
export declare class LegalDocumentEntity extends AbstractEntity {
    id: number;
    title: string;
    content: string;
    type: string;
}
