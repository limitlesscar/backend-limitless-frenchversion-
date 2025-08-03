"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangedFaqEntityName1736069841980 = void 0;
class ChangedFaqEntityName1736069841980 {
    constructor() {
        this.name = 'ChangedFaqEntityName1736069841980';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."FAQs_category_enum" AS ENUM('HOSTS', 'RENTERS', 'INSURANCE', 'LEGAL')`);
        await queryRunner.query(`CREATE TABLE "FAQs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "category" "public"."FAQs_category_enum" NOT NULL, "question" character varying NOT NULL, "answer" text NOT NULL, CONSTRAINT "PK_96f1900ef2bf3e3f116c52895c4" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "FAQs"`);
        await queryRunner.query(`DROP TYPE "public"."FAQs_category_enum"`);
    }
}
exports.ChangedFaqEntityName1736069841980 = ChangedFaqEntityName1736069841980;
//# sourceMappingURL=1736069841980-ChangedFaqEntityName.js.map