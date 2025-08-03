"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHostRelationWithCar1732891388885 = void 0;
class CreateHostRelationWithCar1732891388885 {
    constructor() {
        this.name = 'CreateHostRelationWithCar1732891388885';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "car" ADD "host_id" integer`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_56ca49347f5a7ef3856e9acc481" FOREIGN KEY ("host_id") REFERENCES "host"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_56ca49347f5a7ef3856e9acc481"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "host_id"`);
    }
}
exports.CreateHostRelationWithCar1732891388885 = CreateHostRelationWithCar1732891388885;
//# sourceMappingURL=1732891388885-CreateHostRelationWithCar.js.map