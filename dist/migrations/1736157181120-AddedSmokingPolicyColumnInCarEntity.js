"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedSmokingPolicyColumnInCarEntity1736157181120 = void 0;
class AddedSmokingPolicyColumnInCarEntity1736157181120 {
    constructor() {
        this.name = 'AddedSmokingPolicyColumnInCarEntity1736157181120';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "car" ADD "smoking_policy" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "smoking_policy"`);
    }
}
exports.AddedSmokingPolicyColumnInCarEntity1736157181120 = AddedSmokingPolicyColumnInCarEntity1736157181120;
//# sourceMappingURL=1736157181120-AddedSmokingPolicyColumnInCarEntity.js.map