"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsService = void 0;
const common_1 = require("@nestjs/common");
const faq_repository_1 = require("./repositories/faq.repository");
const legal_document_repository_1 = require("./repositories/legal_document.repository");
let TermsAndConditionsService = class TermsAndConditionsService {
    constructor(faqsRepository, legalDocumentRepository) {
        this.faqsRepository = faqsRepository;
        this.legalDocumentRepository = legalDocumentRepository;
    }
    getHelpCenterDetailsfromDB({ where, select, relations, skip, take, order, }) {
        return this.faqsRepository.findAndCount({
            where,
            select,
            relations,
            skip,
            take,
            order,
        });
    }
    async fetchHelpCenterData(search = "") {
        const [data, total] = await this.getHelpCenterDetailsfromDB({});
        const faqCategories = ["HOSTS", "RENTERS", "INSURANCE", "LEGAL"];
        const sections = faqCategories.map((category) => {
            const filteredFaqs = data.filter((faq) => faq.category === category);
            const searchedFaqs = filteredFaqs.filter((faq) => {
                const searchTerm = search.toLowerCase();
                return (faq.question.toLowerCase().includes(searchTerm) ||
                    faq.answer.toLowerCase().includes(searchTerm) ||
                    faq.category.toLowerCase().includes(searchTerm));
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
};
exports.TermsAndConditionsService = TermsAndConditionsService;
exports.TermsAndConditionsService = TermsAndConditionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [faq_repository_1.FAQsRepository,
        legal_document_repository_1.LegalDocumentRepository])
], TermsAndConditionsService);
//# sourceMappingURL=terms_and_conditions.service.js.map