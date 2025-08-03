import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationDto } from "src/types/pagination/common.dto";

export class PaginationWithTimeZoneDto extends PaginationDto {
  @ApiProperty({
    name: "timezone",
    description: "Time zone of user",
    example: "Asia/Karachi",
    required: false,
  })
  @IsOptional()
  timezone: string;
}
