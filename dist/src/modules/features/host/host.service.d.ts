import { HostRepository } from "./repositories/host.repository";
import { HostEntity } from "./entities/host.entity";
import { FindOptionsWhere, FindOptionsRelations, FindOptionsSelect } from "typeorm";
export declare class HostService {
    private readonly hostRepository;
    constructor(hostRepository: HostRepository);
    createHost(host: Partial<HostEntity>): Promise<HostEntity>;
    getHostFromDB({ where, select, relations, }: {
        where?: FindOptionsWhere<HostEntity>;
        select?: FindOptionsSelect<HostEntity>;
        relations?: FindOptionsRelations<HostEntity>;
    }): Promise<HostEntity>;
    updateHost({ data, where, relations, select, }: {
        data: Partial<HostEntity>;
        where: FindOptionsWhere<HostEntity>;
        relations?: FindOptionsRelations<HostEntity>;
        select?: FindOptionsSelect<HostEntity>;
    }): Promise<HostEntity>;
    getHostWithStars(hostId: number): Promise<object>;
}
