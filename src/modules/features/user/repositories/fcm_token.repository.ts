import { Repository } from "typeorm";
import { FcmTokenEntity } from "../entities/fcm_token.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class FcmTokenRepository extends Repository<FcmTokenEntity> {
  constructor(
    @InjectRepository(FcmTokenEntity) fcm_token: Repository<FcmTokenEntity>,
  ) {
    super(fcm_token.target, fcm_token.manager, fcm_token.queryRunner);
  }
}
