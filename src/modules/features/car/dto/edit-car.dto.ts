import { PartialType } from "@nestjs/swagger";
import { RegisterCarDto } from "./register-car.dto";

export class EditCarDto extends PartialType(RegisterCarDto) {}
