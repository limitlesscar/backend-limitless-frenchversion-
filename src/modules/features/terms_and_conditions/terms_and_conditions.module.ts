import { Module } from "@nestjs/common";
import { TermsAndConditionsController } from "./terms_and_conditions.controller";
import { TermsAndConditionsService } from "./terms_and_conditions.service";
import { FAQsRepository } from "./repositories/faq.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LegalDocumentRepository } from "./repositories/legal_document.repository";
import { FAQEntity } from "./entities/faq.entity";
import { LegalDocumentEntity } from "./entities/legal_document.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FAQEntity, LegalDocumentEntity])],
  controllers: [TermsAndConditionsController],
  providers: [
    TermsAndConditionsService,
    FAQsRepository,
    LegalDocumentRepository,
  ],
})
export class TermsAndConditionsModule {}
