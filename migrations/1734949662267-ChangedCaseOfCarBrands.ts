import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedCaseOfCarBrands1734949662267 implements MigrationInterface {
    name = 'ChangedCaseOfCarBrands1734949662267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."car_brand_enum" RENAME TO "car_brand_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."car_brand_enum" AS ENUM('BMW', 'Audi', 'Mercedes', 'Ford', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Citroen', 'Suzuki', 'Tesla', 'Mitsubishi', 'Alfa-Romeo', 'Chrysler', 'Cupra', 'Daihatsu', 'Dodge', 'Jaguar', 'Jeep', 'Land Rover', 'Lexus', 'MG', 'Maserati', 'Mazda', 'Porsche', 'Skoda', 'Volvo', 'Subaru')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "brand" TYPE "public"."car_brand_enum" USING "brand"::"text"::"public"."car_brand_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_brand_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."car_brand_enum_old" AS ENUM('Mazda', 'Porsche', 'Skoda', 'Volvo', 'Subaru', 'BMW', 'Audi', 'Mercedes', 'Ford', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Citroen', 'Suzuki', 'Tesla', 'Mitsubishi', 'Alfa-Romeo', 'Chrysler', 'Cupra', 'Daihatsu', 'Dodge', 'Jaguar', 'JEEP', 'Land Rover', 'Lexus', 'MG', 'Maserati')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "brand" TYPE "public"."car_brand_enum_old" USING "brand"::"text"::"public"."car_brand_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."car_brand_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_brand_enum_old" RENAME TO "car_brand_enum"`);
    }

}
