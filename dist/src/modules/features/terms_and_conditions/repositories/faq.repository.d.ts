import { Repository } from "typeorm";
import { FAQEntity } from "../entities/faq.entity";
export declare class FAQsRepository extends Repository<FAQEntity> {
    constructor(Faqs: Repository<FAQEntity>);
}
