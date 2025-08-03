import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { TermsAndConditionsService } from "./terms_and_conditions.service";
import { PaginationDto } from "src/types/pagination/common.dto";

@Controller("terms-and-conditions")
@ApiTags("Terms and Conditions")
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
  ) {}
  // ============================================= GET ORDERS FOR MY CAR =============================================
  @ApiOperation({ summary: "Get help center data" })
  @ApiQuery({ name: "search", required: false })
  @Get("")
  async GetHelpCenterData(@Query("search") search: string): Promise<{
    sections: {
      title: string;
      data: {
        id: number;
        title: string;
        answer: string;
      }[];
    }[];
    total: number;
  }> {
    return await this.termsAndConditionsService.fetchHelpCenterData(search);
  }
}
