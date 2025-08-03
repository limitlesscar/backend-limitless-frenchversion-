import { Repository } from "typeorm";
import { OTPTableEntity } from "../entity/otp.entity";
export declare class OtpRepository extends Repository<OTPTableEntity> {
    constructor(otp: Repository<OTPTableEntity>);
}
