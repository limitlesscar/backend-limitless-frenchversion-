import { AbstractEntity } from "src/modules/database/abstract.entity";
export declare class FAQEntity extends AbstractEntity {
    id: number;
    category: string;
    question: string;
    answer: string;
}
