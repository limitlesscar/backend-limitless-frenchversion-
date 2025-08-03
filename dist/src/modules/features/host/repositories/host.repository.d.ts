import { Repository } from "typeorm";
import { HostEntity } from "../entities/host.entity";
export declare class HostRepository extends Repository<HostEntity> {
    constructor(host: Repository<HostEntity>);
}
