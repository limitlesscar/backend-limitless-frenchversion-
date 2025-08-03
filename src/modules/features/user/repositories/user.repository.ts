import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class UserRepository extends Repository<UserEntity> {
  constructor(@InjectRepository(UserEntity) user: Repository<UserEntity>) {
    super(user.target, user.manager, user.queryRunner);
  }
}
