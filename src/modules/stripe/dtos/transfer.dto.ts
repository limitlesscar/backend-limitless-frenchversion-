import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransferDto {
  @ApiProperty({
    description: "Amount to be paid",
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  payable_amount: number;
  @ApiProperty({
    description: "Id of the connected account",
    example: "acct_1MZ1f52eZvKYlo2C",
  })
  @IsNotEmpty()
  @IsString()
  stripe_connected_account_id: string;
  @ApiProperty({
    description: "Transfer group",
  })
  @IsNotEmpty()
  @IsString()
  transfer_group: string;
  @ApiProperty({
    description: "Id of the stripe charge",
    example: "ch_1MZ1f52eZvKYlo2C18f87NlX",
  })
  @IsNotEmpty()
  @IsString()
  stripe_charge_id: string;
}
