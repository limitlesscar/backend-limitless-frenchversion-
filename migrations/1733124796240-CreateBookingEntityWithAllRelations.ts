import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookingEntityWithAllRelations1733124796240 implements MigrationInterface {
    name = 'CreateBookingEntityWithAllRelations1733124796240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('Ongoing', 'Cancelled', 'Completed')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "stars" integer NOT NULL DEFAULT '0', "review_message" character varying(255), "start_date_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date_time" TIMESTAMP WITH TIME ZONE NOT NULL, "amount" integer NOT NULL, "card_last_four" character varying NOT NULL, "card_brand" character varying NOT NULL, "payment_method_id" character varying NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'Ongoing', "user_id" integer, "host_id" integer, "car_id" integer, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc840c32712e71a17c3b401066" ON "booking" ("start_date_time") `);
        await queryRunner.query(`CREATE INDEX "IDX_fac40287f669859e2d4c6b6d4e" ON "booking" ("end_date_time") `);
        await queryRunner.query(`CREATE INDEX "IDX_276896d1a1a30be6de9d7d43f5" ON "booking" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_65570082e424f7a2503f9c8293" ON "booking" ("host_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a152deaa297a2d4ab94f2ef37" ON "booking" ("car_id") `);
        await queryRunner.query(`ALTER TYPE "public"."car_color_enum" RENAME TO "car_color_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."car_color_enum" AS ENUM('Black', 'Red', 'Green', 'Yellow', 'Orange', 'Gray', 'White')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "color" TYPE "public"."car_color_enum" USING "color"::"text"::"public"."car_color_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_color_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."car_features_enum" RENAME TO "car_features_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."car_features_enum" AS ENUM('Child Seat', 'GPS', 'Air Conditioning', 'Bike Rack', 'Snow Tires', 'Cruise Control', 'Snow Chains', 'Apply Carplay', 'Android Auto', 'Four Wheel Drive')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "features" TYPE "public"."car_features_enum"[] USING "features"::"text"::"public"."car_features_enum"[]`);
        await queryRunner.query(`DROP TYPE "public"."car_features_enum_old"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_276896d1a1a30be6de9d7d43f53" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_65570082e424f7a2503f9c82933" FOREIGN KEY ("host_id") REFERENCES "host"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_5a152deaa297a2d4ab94f2ef37e" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_5a152deaa297a2d4ab94f2ef37e"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_65570082e424f7a2503f9c82933"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_276896d1a1a30be6de9d7d43f53"`);
        await queryRunner.query(`CREATE TYPE "public"."car_features_enum_old" AS ENUM('Child Seat', 'GPS', 'Air Conditioning', 'Bike Rack', 'Show Tires', 'Cruise Control', 'Snow Chains', 'Apply Carplay', 'Android Auto', 'Four Wheel Drive')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "features" TYPE "public"."car_features_enum_old"[] USING "features"::"text"::"public"."car_features_enum_old"[]`);
        await queryRunner.query(`DROP TYPE "public"."car_features_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_features_enum_old" RENAME TO "car_features_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."car_color_enum_old" AS ENUM('Black', 'Red', 'Green', 'Yellow', 'Orange', 'Gray')`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "color" TYPE "public"."car_color_enum_old" USING "color"::"text"::"public"."car_color_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."car_color_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_color_enum_old" RENAME TO "car_color_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a152deaa297a2d4ab94f2ef37"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65570082e424f7a2503f9c8293"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_276896d1a1a30be6de9d7d43f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fac40287f669859e2d4c6b6d4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc840c32712e71a17c3b401066"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
    }

}
