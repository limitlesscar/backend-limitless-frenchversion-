"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatRelations1734602612769 = void 0;
class UpdateChatRelations1734602612769 {
    constructor() {
        this.name = 'UpdateChatRelations1734602612769';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_0f100b22a6161600aa5ebafb5e0"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "userChatId"`);
        await queryRunner.query(`ALTER TABLE "user_chat" ADD "chat_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_chat" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_chat" ADD CONSTRAINT "FK_5366da78c4f08914a33f6e23d51" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chat" ADD CONSTRAINT "FK_7633fe1395d0705b301a21cf4d3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_chat" DROP CONSTRAINT "FK_7633fe1395d0705b301a21cf4d3"`);
        await queryRunner.query(`ALTER TABLE "user_chat" DROP CONSTRAINT "FK_5366da78c4f08914a33f6e23d51"`);
        await queryRunner.query(`ALTER TABLE "user_chat" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_chat" DROP COLUMN "chat_id"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "userChatId" integer`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_0f100b22a6161600aa5ebafb5e0" FOREIGN KEY ("userChatId") REFERENCES "user_chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.UpdateChatRelations1734602612769 = UpdateChatRelations1734602612769;
//# sourceMappingURL=1734602612769-UpdateChatRelations.js.map