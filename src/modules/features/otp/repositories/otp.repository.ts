import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OTPTableEntity } from "../entity/otp.entity";

export class OtpRepository extends Repository<OTPTableEntity> {
  constructor(
    @InjectRepository(OTPTableEntity)
    otp: Repository<OTPTableEntity>,
  ) {
    super(otp.target, otp.manager, otp.queryRunner);
  }
}
