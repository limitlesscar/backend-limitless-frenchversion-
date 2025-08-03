import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "../entities/admin.entity";

@Injectable()
export class AdminRepository extends Repository<AdminEntity> {
  constructor(@InjectRepository(AdminEntity) admin: Repository<AdminEntity>) {
    super(admin.target, admin.manager, admin.queryRunner);
  }
}
