"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsModule = void 0;
const common_1 = require("@nestjs/common");
const terms_and_conditions_controller_1 = require("./terms_and_conditions.controller");
const terms_and_conditions_service_1 = require("./terms_and_conditions.service");
const faq_repository_1 = require("./repositories/faq.repository");
const typeorm_1 = require("@nestjs/typeorm");
const legal_document_repository_1 = require("./repositories/legal_document.repository");
const faq_entity_1 = require("./entities/faq.entity");
const legal_document_entity_1 = require("./entities/legal_document.entity");
let TermsAndConditionsModule = class TermsAndConditionsModule {
};
exports.TermsAndConditionsModule = TermsAndConditionsModule;
exports.TermsAndConditionsModule = TermsAndConditionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([faq_entity_1.FAQEntity, legal_document_entity_1.LegalDocumentEntity])],
        controllers: [terms_and_conditions_controller_1.TermsAndConditionsController],
        providers: [
            terms_and_conditions_service_1.TermsAndConditionsService,
            faq_repository_1.FAQsRepository,
            legal_document_repository_1.LegalDocumentRepository,
        ],
    })
], TermsAndConditionsModule);
//# sourceMappingURL=terms_and_conditions.module.js.map