import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenHash1783709002322 implements MigrationInterface {
  name = 'AddRefreshTokenHash1783709002322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refresh_token_hash" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "refresh_token_hash"`,
    );
  }
}
