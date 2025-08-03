import { TermsAndConditionsService } from "./terms_and_conditions.service";
export declare class TermsAndConditionsController {
    private readonly termsAndConditionsService;
    constructor(termsAndConditionsService: TermsAndConditionsService);
    GetHelpCenterData(search: string): Promise<{
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
