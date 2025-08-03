import { Module } from "@nestjs/common";
import { HostService } from "./host.service";
import { HostController } from "./host.controller";
import { HostRepository } from "./repositories/host.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HostEntity } from "./entities/host.entity";

@Module({
  imports: [TypeOrmModule.forFeature([HostEntity])],
  controllers: [HostController],
  providers: [HostService, HostRepository],
  exports: [HostService, HostRepository],
})
export class HostModule {}
