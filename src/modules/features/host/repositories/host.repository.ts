import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HostEntity } from "../entities/host.entity";

export class HostRepository extends Repository<HostEntity> {
  constructor(@InjectRepository(HostEntity) host: Repository<HostEntity>) {
    super(host.target, host.manager, host.queryRunner);
  }
}
