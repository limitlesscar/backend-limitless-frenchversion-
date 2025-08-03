import { VehicleType } from "../enums/vehicle-type.enum";
import { CarFeatures } from "../enums/features.enum";
import { TransmissionType } from "../enums/transmission-type.enum";
import { EngineType } from "../enums/engine-type.enum";
import { CarBrand } from "../enums/brand.enum";
export declare class FilterCarDto {
    vehicle_type?: VehicleType[];
    features?: CarFeatures[];
    minimum_seats?: number;
    total_price?: number;
    less_than_five_years?: boolean;
    gearbox?: TransmissionType;
    engine_type?: EngineType;
    brand?: CarBrand[];
    start_date_time: string;
    end_date_time: string;
    address: string;
    skip: number;
    take: number;
}
