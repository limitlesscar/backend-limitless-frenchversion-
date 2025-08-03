import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
export class PaginationDto {
  @ApiProperty({
    name: "skip",
    description: "Number of items to skip",
    example: 0,
  })
  @Type(() => Number)
  @IsOptional()
  skip: number;
  @ApiProperty({
    name: "take",
    description: "Number of items to take",
    example: 10,
  })
  @Type(() => Number)
  @IsOptional()
  take: number;
}
