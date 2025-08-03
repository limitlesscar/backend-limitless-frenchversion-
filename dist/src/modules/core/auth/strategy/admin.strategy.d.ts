import { ConfigService } from "@nestjs/config";
import { AdminEntity } from "src/modules/features/admin/entities/admin.entity";
import { AdminRepository } from "src/modules/features/admin/repositories/admin.repository";
import { JWT } from "src/types/common.type";
declare const JwtAdminStrategy_base: any;
export declare class JwtAdminStrategy extends JwtAdminStrategy_base {
    private readonly adminRepository;
    constructor(configService: ConfigService, adminRepository: AdminRepository);
    validate({ id }: JWT): Promise<AdminEntity | null>;
}
export {};
