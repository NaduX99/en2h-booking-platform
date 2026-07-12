import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1783706620726 implements MigrationInterface {
  name = 'InitialSchema1783706620726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(150) NOT NULL, "description" text NOT NULL, "duration_minutes" integer NOT NULL, "price" numeric(10,2) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_name" character varying(100) NOT NULL, "customer_email" character varying(150) NOT NULL, "customer_phone" character varying(30) NOT NULL, "service_id" uuid NOT NULL, "booking_date" date NOT NULL, "booking_time" TIME NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'PENDING', "notes" text, "cancelled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_booking_service_date_time" UNIQUE ("service_id", "booking_date", "booking_time"), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b8ca4fb605f5492daaf82cbffd" ON "bookings" ("customer_email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df22e2beaabc33a432b4f65e3c" ON "bookings" ("service_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b43f68def0b753efccd9aa68c" ON "bookings" ("booking_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_48b267d894e32a25ebde4b207a" ON "bookings" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_df22e2beaabc33a432b4f65e3c2" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_df22e2beaabc33a432b4f65e3c2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_48b267d894e32a25ebde4b207a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b43f68def0b753efccd9aa68c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df22e2beaabc33a432b4f65e3c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b8ca4fb605f5492daaf82cbffd"`,
    );
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
