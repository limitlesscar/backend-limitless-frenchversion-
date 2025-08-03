"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedEnumValuesInCarEntity1733210077200 = void 0;
class AddedEnumValuesInCarEntity1733210077200 {
    constructor() {
        this.name = 'AddedEnumValuesInCarEntity1733210077200';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."car_vehicle_type_enum" AS ENUM('Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe', 'Family Van', '4x4', 'Convertible', 'Sports Car', 'Limousine', 'Exotic Car', 'Pickup Truck', 'Electric Vehicle (EV)', 'Hybrid Vehicle')`);
        await queryRunner.query(`ALTER TABLE "car" ADD "vehicle_type" "public"."car_vehicle_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_engine_type_enum" RENAME TO "car_engine_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."car_engine_type_enum" AS ENUM('Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Combustion')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "engine_type" TYPE "public"."car_engine_type_enum" USING "engine_type"::"text"::"public"."car_engine_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_engine_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."car_transmission_type_enum" RENAME TO "car_transmission_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."car_transmission_type_enum" AS ENUM('Automatic', 'Manual', 'All')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "transmission_type" TYPE "public"."car_transmission_type_enum" USING "transmission_type"::"text"::"public"."car_transmission_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_transmission_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."booking_status_enum" RENAME TO "booking_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('Ongoing', 'Upcoming', 'Cancelled', 'Completed')`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" TYPE "public"."booking_status_enum" USING "status"::"text"::"public"."booking_status_enum"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" SET DEFAULT 'Ongoing'`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum_old"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum_old" AS ENUM('Ongoing', 'Cancelled', 'Completed')`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" TYPE "public"."booking_status_enum_old" USING "status"::"text"::"public"."booking_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" SET DEFAULT 'Ongoing'`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."booking_status_enum_old" RENAME TO "booking_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."car_transmission_type_enum_old" AS ENUM('Automatic', 'Manual')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "transmission_type" TYPE "public"."car_transmission_type_enum_old" USING "transmission_type"::"text"::"public"."car_transmission_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."car_transmission_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_transmission_type_enum_old" RENAME TO "car_transmission_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."car_engine_type_enum_old" AS ENUM('Gasoline', 'Diesel', 'Electric', 'Hybrid')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "engine_type" TYPE "public"."car_engine_type_enum_old" USING "engine_type"::"text"::"public"."car_engine_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."car_engine_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_engine_type_enum_old" RENAME TO "car_engine_type_enum"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "vehicle_type"`);
        await queryRunner.query(`DROP TYPE "public"."car_vehicle_type_enum"`);
    }
}
exports.AddedEnumValuesInCarEntity1733210077200 = AddedEnumValuesInCarEntity1733210077200;
//# sourceMappingURL=1733210077200-AddedEnumValuesInCarEntity.js.map