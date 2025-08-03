import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty, IsInt, Min } from "class-validator";
import { USER_TYPE_ENUM } from "../../user/enums/user-role.enum";
import { Type } from "class-transformer";

export class GetDbUsersDTO {
  @ApiProperty({
    description: "No of pages you want to display",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({
    description: "No of entries you want to display by default it is 10",
    example: "10",
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @ApiProperty({
    name: "search",
    description: "Search for users by name, email, or phone number",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
  @ApiProperty({
    name: "role",
    description: "Filter users by role",
    enum: USER_TYPE_ENUM,
    required: false,
    // example: [USER_TYPE_ENUM.HOST, USER_TYPE_ENUM.USER],
  })
  @IsOptional()
  @IsString()
  role: string;
  @ApiProperty({
    name: "status",
    description: "Filter users by status",
    example: ["Approved", "Pending", "Rejected"],
    default: "Approved",
    required: false,
  })
  @IsString()
  status: string;
}
