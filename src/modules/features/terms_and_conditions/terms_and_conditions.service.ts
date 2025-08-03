import { Injectable } from "@nestjs/common";
import { FAQsRepository } from "./repositories/faq.repository";
import { LegalDocumentRepository } from "./repositories/legal_document.repository";
import { FAQEntity } from "./entities/faq.entity";
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
  FindOptionsOrder,
} from "typeorm";
import { PaginationDto } from "src/types/pagination/common.dto";

@Injectable()
export class TermsAndConditionsService {
  constructor(
    private readonly faqsRepository: FAQsRepository,
    private readonly legalDocumentRepository: LegalDocumentRepository,
  ) {}
  // ============================================= GET FAQ BY WHERE CLAUSE =============================================
  /**
   * Retrieves a single `FAQEntity` from the database based on the provided criteria.
   *    
   * @param {Object} options - An object containing the parameters for the database query.
   * @param {FindOptionsWhere<FAQEntity>} [options.where] - An optional object specifying the criteria to find the FAQ.
   * @param {FindOptionsSelect<FAQEntity>} [options.select] - An optional parameter specifying the fields to be selected from the FAQ entity.
   * @param {FindOptionsRelations<FAQEntity>} [options.relations] - An optional parameter specifying the relations to be included in the query.
   * @returns {Promise<FAQEntity>} - A Promise that resolves to the retrieved `FAQEntity`.
   * @throws {NotFoundException} - If no FAQ is found with the provided criteria.
   * @throws {InternalServerErrorException} - If an error occurs while retrieving the FAQ.
   * @example
   * const faq = await this.termsAndConditionsService.getFAQ({ where: { id: 1 } });
   * console.log(faq);
   * // Output: { id: 1, question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
  /** */
  getHelpCenterDetailsfromDB({
    where,
    select,
    relations,
    skip,
    take,
    order,
  }: {
    where?: FindOptionsWhere<FAQEntity>;
    select?: FindOptionsSelect<FAQEntity>;
    relations?: FindOptionsRelations<FAQEntity>;
    take?: number;
    skip?: number;
    order?: FindOptionsOrder<FAQEntity>;
  }): Promise<[FAQEntity[], number]> {
    return this.faqsRepository.findAndCount({
      where,
      select,
      relations,
      skip,
      take,
      order,
    });
  }
  async fetchHelpCenterData(search: string = "") {
    const [data, total] = await this.getHelpCenterDetailsfromDB({});

    const faqCategories = ["HOSTS", "RENTERS", "INSURANCE", "LEGAL"];

    const sections = faqCategories.map((category) => {
      const filteredFaqs = data.filter((faq) => faq.category === category);

      const searchedFaqs = filteredFaqs.filter((faq) => {
        const searchTerm = search.toLowerCase();
        return (
          faq.question.toLowerCase().includes(searchTerm) ||
          faq.answer.toLowerCase().includes(searchTerm) ||
          faq.category.toLowerCase().includes(searchTerm)
        );
      });

      return {
        title: category,
        data: searchedFaqs.map((faq) => ({
          id: faq.id,
          title: faq.question,
          answer: faq.answer,
        })),
      };
    });

    return {
      sections,
      total,
    };
  }
}
