"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedIsUnpublishedColumnInCar1733118012549 = void 0;
class AddedIsUnpublishedColumnInCar1733118012549 {
    constructor() {
        this.name = 'AddedIsUnpublishedColumnInCar1733118012549';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "car" ADD "is_unpublished" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "is_unpublished"`);
    }
}
exports.AddedIsUnpublishedColumnInCar1733118012549 = AddedIsUnpublishedColumnInCar1733118012549;
//# sourceMappingURL=1733118012549-AddedIsUnpublishedColumnInCar.js.map