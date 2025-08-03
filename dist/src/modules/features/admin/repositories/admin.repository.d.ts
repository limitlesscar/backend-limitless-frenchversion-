import { Repository } from "typeorm";
import { AdminEntity } from "../entities/admin.entity";
export declare class AdminRepository extends Repository<AdminEntity> {
    constructor(admin: Repository<AdminEntity>);
}
