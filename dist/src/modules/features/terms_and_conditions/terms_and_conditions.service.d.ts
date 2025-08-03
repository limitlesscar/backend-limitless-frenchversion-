import { FAQsRepository } from "./repositories/faq.repository";
import { LegalDocumentRepository } from "./repositories/legal_document.repository";
import { FAQEntity } from "./entities/faq.entity";
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, FindOptionsOrder } from "typeorm";
export declare class TermsAndConditionsService {
    private readonly faqsRepository;
    private readonly legalDocumentRepository;
    constructor(faqsRepository: FAQsRepository, legalDocumentRepository: LegalDocumentRepository);
    getHelpCenterDetailsfromDB({ where, select, relations, skip, take, order, }: {
        where?: FindOptionsWhere<FAQEntity>;
        select?: FindOptionsSelect<FAQEntity>;
        relations?: FindOptionsRelations<FAQEntity>;
        take?: number;
        skip?: number;
        order?: FindOptionsOrder<FAQEntity>;
    }): Promise<[FAQEntity[], number]>;
    fetchHelpCenterData(search?: string): Promise<{
        sections: {
            title: string;
            data: {
                id: number;
                title: string;
                answer: string;
            }[];
        }[];
        total: number;
    }>;
}
