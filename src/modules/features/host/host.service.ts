import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { HostRepository } from "./repositories/host.repository";
import { HostEntity } from "./entities/host.entity";
import {
  FindOptionsWhere,
  FindOptionsRelations,
  FindOptionsSelect,
} from "typeorm";
import { throwHttpException } from "src/utils/app/httpException";
import { HttpStatusCode } from "axios";
import { BookingStatus } from "../booking/enums/booking-status.enum";

@Injectable()
export class HostService {
  constructor(private readonly hostRepository: HostRepository) {}
  // ============================================= CREATE HOST =============================================

  async createHost(host: Partial<HostEntity>): Promise<HostEntity> {
    const created = this.hostRepository.create(host);
    return await this.hostRepository.save(created);
  }

  //   ============================================= GET HOST FROM DB =============================================

  getHostFromDB({
    where,
    select,
    relations,
  }: {
    where?: FindOptionsWhere<HostEntity>;
    select?: FindOptionsSelect<HostEntity>;
    relations?: FindOptionsRelations<HostEntity>;
  }): Promise<HostEntity> {
    return this.hostRepository.findOne({
      where,
      select,
      relations,
    });
  }

  //   ============================================= UPDATE HOST =============================================
  async updateHost({
    data,
    where,
    relations,
    select,
  }: {
    data: Partial<HostEntity>;
    where: FindOptionsWhere<HostEntity>;
    relations?: FindOptionsRelations<HostEntity>;
    select?: FindOptionsSelect<HostEntity>;
  }): Promise<HostEntity> {
    await this.hostRepository.update(where, data);
    return this.getHostFromDB({ where, relations, select });
  }
  async getHostWithStars(hostId: number): Promise<object> {
    try {
      const host = this.hostRepository
        .createQueryBuilder("host")
        .leftJoin(
          "host.bookings",
          "hostBookings",
          "hostBookings.status = :status",
          {
            status: BookingStatus.COMPLETED,
          },
        )
        .innerJoin("host.user", "user")
        .where("host.id = :hostId", { hostId: hostId })

        .select([
          `json_build_object('id',host.id,'host_user_id',"user"."id",'full_name',"user"."full_name",'profile_picture',"user"."profile_picture",'phone_number',"user"."phone_number",'stars',COALESCE(ROUND(SUM(hostBookings.stars) * 1.0 / NULLIF(COUNT(DISTINCT hostBookings.id), 0), 2), 0))as host`,
        ])
        .groupBy(`host.id,"user"."id"`);
      return await host.getRawOne();
    } catch (error) {
      console.log(error);
      throwHttpException(
        ["Unable to fetch host with stars"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
