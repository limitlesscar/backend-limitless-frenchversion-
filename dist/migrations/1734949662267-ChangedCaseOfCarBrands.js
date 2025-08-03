"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangedCaseOfCarBrands1734949662267 = void 0;
class ChangedCaseOfCarBrands1734949662267 {
    constructor() {
        this.name = 'ChangedCaseOfCarBrands1734949662267';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "public"."car_brand_enum" RENAME TO "car_brand_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."car_brand_enum" AS ENUM('BMW', 'Audi', 'Mercedes', 'Ford', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Citroen', 'Suzuki', 'Tesla', 'Mitsubishi', 'Alfa-Romeo', 'Chrysler', 'Cupra', 'Daihatsu', 'Dodge', 'Jaguar', 'Jeep', 'Land Rover', 'Lexus', 'MG', 'Maserati', 'Mazda', 'Porsche', 'Skoda', 'Volvo', 'Subaru')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "brand" TYPE "public"."car_brand_enum" USING "brand"::"text"::"public"."car_brand_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_brand_enum_old"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."car_brand_enum_old" AS ENUM('Mazda', 'Porsche', 'Skoda', 'Volvo', 'Subaru', 'BMW', 'Audi', 'Mercedes', 'Ford', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Citroen', 'Suzuki', 'Tesla', 'Mitsubishi', 'Alfa-Romeo', 'Chrysler', 'Cupra', 'Daihatsu', 'Dodge', 'Jaguar', 'JEEP', 'Land Rover', 'Lexus', 'MG', 'Maserati')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "brand" TYPE "public"."car_brand_enum_old" USING "brand"::"text"::"public"."car_brand_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."car_brand_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_brand_enum_old" RENAME TO "car_brand_enum"`);
    }
}
exports.ChangedCaseOfCarBrands1734949662267 = ChangedCaseOfCarBrands1734949662267;
//# sourceMappingURL=1734949662267-ChangedCaseOfCarBrands.js.map