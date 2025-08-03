import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedTableForFAQs1735761651689 implements MigrationInterface {
    name = 'CreatedTableForFAQs1735761651689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."legal_document_type_enum" AS ENUM('TERMS_CONDITIONS', 'PRIVACY_POLICY')`);
        await queryRunner.query(`CREATE TABLE "legal_document" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "content" text NOT NULL, "type" "public"."legal_document_type_enum" NOT NULL, CONSTRAINT "PK_950166ad59d051a80cad8337c76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."faq_entity_category_enum" AS ENUM('HOSTS', 'RENTERS', 'INSURANCE', 'LEGAL')`);
        await queryRunner.query(`CREATE TABLE "faq_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "category" "public"."faq_entity_category_enum" NOT NULL, "question" character varying NOT NULL, "answer" text NOT NULL, CONSTRAINT "PK_145bd0785c33e9e22443895675e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "faq_entity"`);
        await queryRunner.query(`DROP TYPE "public"."faq_entity_category_enum"`);
        await queryRunner.query(`DROP TABLE "legal_document"`);
        await queryRunner.query(`DROP TYPE "public"."legal_document_type_enum"`);
    }

}
