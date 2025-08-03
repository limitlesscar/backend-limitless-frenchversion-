import { AbstractEntity } from "src/modules/database/abstract.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { CarBrand } from "../enums/brand.enum";
import { VehicleType } from "../enums/vehicle-type.enum";
import { EngineType } from "../enums/engine-type.enum";
import { TransmissionType } from "../enums/transmission-type.enum";
import { Point } from "geojson";
import { CarFeatures } from "../enums/features.enum";
import { BookingEntity } from "../../booking/entities/booking.entity";
import { HostEntity } from "../../host/entities/host.entity";
@Entity("car")
export class CarEntity extends AbstractEntity {
  // ======================== CAR INFORMATION ===============================
  @Column({ type: "varchar", length: 255 })
  @Index()
  name: string;

  @Column({ type: "varchar", array: true })
  images: string[];

  @Column({ type: "enum", enum: CarBrand })
  brand: CarBrand;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column({ type: "int" })
  price_per_day: number;

  @Column({ type: "int" })
  price_per_hour: number;

  @Column({ type: "enum", enum: VehicleType })
  vehicle_type: VehicleType;

  @Column({ type: "varchar", length: 255 })
  country_of_manufacture: string;

  @Column({ type: "varchar", length: 255 })
  city_of_registeration: string;

  //   ======================= CAR SPECIFICATIONS ===============================
  @Column({ type: "varchar", nullable: true })
  color_code: string;

  @Column({ type: "int" })
  mileage: number;

  @Column({ type: "enum", enum: EngineType })
  engine_type: EngineType;

  @Column({
    type: "enum",
    enum: TransmissionType,
  })
  transmission_type: TransmissionType;

  @Column({ type: "int" })
  fuel_economy: number;

  @Column({ type: "varchar" })
  available_start_date_time: string;

  @Column({ type: "varchar" })
  available_end_date_time: string;

  @Column({ type: "varchar" })
  pickup_address: string;

  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  pickup_location: Point;

  @Column({ type: "varchar" })
  dropoff_address: string;

  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  dropoff_location: Point;

  //   ======================= CAR FEATURES ===============================
  @Column({ type: "enum", enum: CarFeatures, array: true })
  features: CarFeatures[];

  @Column({ type: "int" })
  maximum_passengers: number;

  @Column({ type: "int" })
  luggage_capacity: number;

  @Column({ type: "boolean", default: false })
  insurance_included: boolean;

  @Column({ type: "boolean", default: false })
  pet_policy: boolean;

  @Column({ type: "boolean", default: false })
  smoking_policy: boolean;

  @Column({ type: "boolean", default: false })
  is_unpublished: boolean;

  @Column({ type: "boolean", default: false })
  isBooked: boolean;

  //   ======================== CAR VERIFICATION ===============================
  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  // ========================== RELATIONS ===============================
  @ManyToOne(() => HostEntity, (host) => host.cars)
  @JoinColumn({ name: "host_id" })
  host: HostEntity;

  @OneToMany(() => BookingEntity, (booking) => booking.car)
  bookings: BookingEntity[];
}
