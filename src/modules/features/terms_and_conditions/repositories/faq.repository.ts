import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FAQEntity } from "../entities/faq.entity";

@Injectable()
export class FAQsRepository extends Repository<FAQEntity> {
  constructor(@InjectRepository(FAQEntity) Faqs: Repository<FAQEntity>) {
    super(Faqs.target, Faqs.manager, Faqs.queryRunner);
  }
}
