"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedMoreCarBrands1734948717901 = void 0;
class AddedMoreCarBrands1734948717901 {
    constructor() {
        this.name = 'AddedMoreCarBrands1734948717901';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "public"."car_brand_enum" RENAME TO "car_brand_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."car_brand_enum" AS ENUM('BMW', 'Audi', 'Mercedes', 'Ford', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Citroen', 'Suzuki', 'Tesla', 'Mitsubishi', 'Alfa-Romeo', 'Chrysler', 'Cupra', 'Daihatsu', 'Dodge', 'Jaguar', 'JEEP', 'Land Rover', 'Lexus', 'MG', 'Maserati', 'Mazda', 'Porsche', 'Skoda', 'Volvo', 'Subaru')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "brand" TYPE "public"."car_brand_enum" USING "brand"::"text"::"public"."car_brand_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_brand_enum_old"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."car_brand_enum_old" AS ENUM('BMW', 'Audi', 'Mercedes', 'Ford', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Citroen', 'Suzuki')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "brand" TYPE "public"."car_brand_enum_old" USING "brand"::"text"::"public"."car_brand_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."car_brand_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_brand_enum_old" RENAME TO "car_brand_enum"`);
    }
}
exports.AddedMoreCarBrands1734948717901 = AddedMoreCarBrands1734948717901;
//# sourceMappingURL=1734948717901-AddedMoreCarBrands.js.map