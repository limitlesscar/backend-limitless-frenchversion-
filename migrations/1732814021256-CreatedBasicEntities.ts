import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedBasicEntities1732814021256 implements MigrationInterface {
    name = 'CreatedBasicEntities1732814021256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "password" character varying NOT NULL, "user_type" "public"."user_user_type_enum" array NOT NULL, "onboarding_status" "public"."user_onboarding_status_enum" NOT NULL, "date_of_birth" character varying, "profile_picture" character varying, "id_card_front" character varying, "emergency_contact" character varying, "id_card_back" character varying, "license_number" character varying, "license_image" character varying, "expiry_date" character varying, "location" geography(Point,4326), "is_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_65e29b09a064487efd3e96c468" ON "user" ("full_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_01eea41349b6c9275aec646eee" ON "user" ("phone_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_60e71e288bab95a5ac05f58a84" ON "user" ("user_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_af7cabf8e064aa7bad09c731ba" ON "user" USING GiST ("location") `);
        await queryRunner.query(`CREATE TYPE "public"."car_brand_enum" AS ENUM('BMW', 'Audi', 'Mercedes', 'Ford', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Citroen', 'Suzuki')`);
        await queryRunner.query(`CREATE TYPE "public"."car_vehicle_type_enum" AS ENUM('Sedan', 'SUV', 'Truck')`);
        await queryRunner.query(`CREATE TYPE "public"."car_color_enum" AS ENUM('Black', 'Red', 'Green', 'Yellow', 'Orange', 'Gray')`);
        await queryRunner.query(`CREATE TYPE "public"."car_engine_type_enum" AS ENUM('Gasoline', 'Diesel', 'Electric', 'Hybrid')`);
        await queryRunner.query(`CREATE TYPE "public"."car_transmission_type_enum" AS ENUM('Automatic', 'Manual')`);
        await queryRunner.query(`CREATE TYPE "public"."car_features_enum" AS ENUM('Child Seat', 'GPS', 'Air Conditioning', 'Bike Rack', 'Show Tires', 'Cruise Control', 'Snow Chains', 'Apply Carplay', 'Android Auto', 'Four Wheel Drive')`);
        await queryRunner.query(`CREATE TABLE "car" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(255), "images" character varying array, "brand" "public"."car_brand_enum", "description" character varying(255), "price_per_day" integer, "price_per_hour" integer, "vehicle_type" "public"."car_vehicle_type_enum", "country_of_manufacture" character varying(255), "city_of_registeration" character varying(255), "color" "public"."car_color_enum", "mileage" integer, "engine_type" "public"."car_engine_type_enum", "transmission_type" "public"."car_transmission_type_enum", "fuel_economy" integer, "available_start_date_time" character varying, "available_end_date_time" character varying, "pickup_address" character varying, "pickup_location" geography(Point,4326), "dropoff_address" character varying, "dropoff_location" geography(Point,4326), "features" "public"."car_features_enum" array, "maximum_passengers" integer, "luggage_capacity" integer, "insurance_included" boolean DEFAULT false, "pet_policy" boolean DEFAULT false, "is_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_27f0e938a6329d73630f5e52a7" ON "car" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_9f0b9c4c74e200ca1e33aed773" ON "car" USING GiST ("pickup_location") `);
        await queryRunner.query(`CREATE INDEX "IDX_a9060cc06b881dfa33a7476150" ON "car" USING GiST ("dropoff_location") `);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_258d028d322ea3b856bf9f12f25" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "host" ADD CONSTRAINT "FK_99808f0f90dd29133325249c2fb" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "host" DROP CONSTRAINT "FK_99808f0f90dd29133325249c2fb"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_258d028d322ea3b856bf9f12f25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a9060cc06b881dfa33a7476150"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f0b9c4c74e200ca1e33aed773"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_27f0e938a6329d73630f5e52a7"`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP TYPE "public"."car_features_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_transmission_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_engine_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_color_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_vehicle_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_brand_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af7cabf8e064aa7bad09c731ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60e71e288bab95a5ac05f58a84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01eea41349b6c9275aec646eee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65e29b09a064487efd3e96c468"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
