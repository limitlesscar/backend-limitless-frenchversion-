import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntitiesForChat1734518861157 implements MigrationInterface {
    name = 'CreateEntitiesForChat1734518861157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_58a8f388ab6b518ea78796ffd7e"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "notificationsId" TO "chatsId"`);
        await queryRunner.query(`CREATE TABLE "chat_message" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "message" character varying NOT NULL, "chat_id" integer, "sender_id" integer, CONSTRAINT "PK_3cc0d85193aade457d3077dd06b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userChatId" integer, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_chat_chat_type_enum" AS ENUM('As Host', 'As Customer')`);
        await queryRunner.query(`CREATE TABLE "user_chat" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "chat_type" "public"."user_chat_chat_type_enum" NOT NULL, CONSTRAINT "PK_c43d9c7669f5c12f23686e1b891" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "images" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "brand" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "price_per_day" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "price_per_hour" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "vehicle_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "country_of_manufacture" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "city_of_registeration" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "color" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "mileage" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "engine_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "transmission_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "fuel_economy" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "available_start_date_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "available_end_date_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "pickup_address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "dropoff_address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "features" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "maximum_passengers" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "luggage_capacity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "insurance_included" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "pet_policy" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_634db173c52edece8dd88ea3d4c" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_bd00cce706735f1c4d05c69a310" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_0f100b22a6161600aa5ebafb5e0" FOREIGN KEY ("userChatId") REFERENCES "user_chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_cc6e489ffa38c4b953719b694ca" FOREIGN KEY ("chatsId") REFERENCES "user_chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cc6e489ffa38c4b953719b694ca"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_0f100b22a6161600aa5ebafb5e0"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_bd00cce706735f1c4d05c69a310"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_634db173c52edece8dd88ea3d4c"`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "pet_policy" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "insurance_included" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "luggage_capacity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "maximum_passengers" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "features" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "dropoff_address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "pickup_address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "available_end_date_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "available_start_date_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "fuel_economy" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "transmission_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "engine_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "mileage" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "color" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "city_of_registeration" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "country_of_manufacture" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "vehicle_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "price_per_hour" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "price_per_day" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "brand" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "images" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "user_chat"`);
        await queryRunner.query(`DROP TYPE "public"."user_chat_chat_type_enum"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "chat_message"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "chatsId" TO "notificationsId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_58a8f388ab6b518ea78796ffd7e" FOREIGN KEY ("notificationsId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
