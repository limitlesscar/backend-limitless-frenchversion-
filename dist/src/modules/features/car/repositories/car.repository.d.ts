import { Repository } from "typeorm";
import { CarEntity } from "../entities/car.entity";
export declare class CarRepository extends Repository<CarEntity> {
    constructor(car: Repository<CarEntity>);
}
