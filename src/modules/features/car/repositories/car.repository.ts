import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CarEntity } from "../entities/car.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CarRepository extends Repository<CarEntity> {
  constructor(@InjectRepository(CarEntity) car: Repository<CarEntity>) {
    super(car.target, car.manager, car.queryRunner);
  }
}
