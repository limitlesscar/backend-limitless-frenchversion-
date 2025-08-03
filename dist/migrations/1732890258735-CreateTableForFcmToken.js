"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTableForFcmToken1732890258735 = void 0;
class CreateTableForFcmToken1732890258735 {
    constructor() {
        this.name = 'CreateTableForFcmToken1732890258735';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "fcm_token" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "token" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_ec8f7ff07f44545126442edd9e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "available_start_date_time"`);
        await queryRunner.query(`ALTER TABLE "car" ADD "available_start_date_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "available_end_date_time"`);
        await queryRunner.query(`ALTER TABLE "car" ADD "available_end_date_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "fcm_token" ADD CONSTRAINT "FK_260df94c40407731f062dceee02" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "fcm_token" DROP CONSTRAINT "FK_260df94c40407731f062dceee02"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "available_end_date_time"`);
        await queryRunner.query(`ALTER TABLE "car" ADD "available_end_date_time" character varying`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "available_start_date_time"`);
        await queryRunner.query(`ALTER TABLE "car" ADD "available_start_date_time" character varying`);
        await queryRunner.query(`DROP TABLE "fcm_token"`);
    }
}
exports.CreateTableForFcmToken1732890258735 = CreateTableForFcmToken1732890258735;
//# sourceMappingURL=1732890258735-CreateTableForFcmToken.js.map