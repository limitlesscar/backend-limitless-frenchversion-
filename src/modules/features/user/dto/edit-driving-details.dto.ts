import { OmitType, PartialType } from "@nestjs/swagger";
import { DrivingDetailsDto } from "./driving-details.dto";

export class EditDrivingDetailsDto extends PartialType(
  OmitType(DrivingDetailsDto, ["license_image", "license_number"]),
) {}
