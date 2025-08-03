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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const terms_and_conditions_service_1 = require("./terms_and_conditions.service");
let TermsAndConditionsController = class TermsAndConditionsController {
    constructor(termsAndConditionsService) {
        this.termsAndConditionsService = termsAndConditionsService;
    }
    async GetHelpCenterData(search) {
        return await this.termsAndConditionsService.fetchHelpCenterData(search);
    }
};
exports.TermsAndConditionsController = TermsAndConditionsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get help center data" }),
    (0, swagger_1.ApiQuery)({ name: "search", required: false }),
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TermsAndConditionsController.prototype, "GetHelpCenterData", null);
exports.TermsAndConditionsController = TermsAndConditionsController = __decorate([
    (0, common_1.Controller)("terms-and-conditions"),
    (0, swagger_1.ApiTags)("Terms and Conditions"),
    __metadata("design:paramtypes", [terms_and_conditions_service_1.TermsAndConditionsService])
], TermsAndConditionsController);
//# sourceMappingURL=terms_and_conditions.controller.js.map