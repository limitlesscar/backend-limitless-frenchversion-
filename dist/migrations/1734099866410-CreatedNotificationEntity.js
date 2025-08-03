"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatedNotificationEntity1734099866410 = void 0;
class CreatedNotificationEntity1734099866410 {
    constructor() {
        this.name = 'CreatedNotificationEntity1734099866410';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "message" character varying NOT NULL, "navigate_to" character varying NOT NULL, "resource_id" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "notificationsId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_58a8f388ab6b518ea78796ffd7e" FOREIGN KEY ("notificationsId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_58a8f388ab6b518ea78796ffd7e"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "notificationsId"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }
}
exports.CreatedNotificationEntity1734099866410 = CreatedNotificationEntity1734099866410;
//# sourceMappingURL=1734099866410-CreatedNotificationEntity.js.map