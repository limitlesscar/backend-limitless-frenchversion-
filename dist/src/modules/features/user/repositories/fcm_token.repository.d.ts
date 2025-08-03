import { Repository } from "typeorm";
import { FcmTokenEntity } from "../entities/fcm_token.entity";
export declare class FcmTokenRepository extends Repository<FcmTokenEntity> {
    constructor(fcm_token: Repository<FcmTokenEntity>);
}
