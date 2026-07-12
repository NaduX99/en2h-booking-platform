import { QueryRunner } from 'typeorm';

import { InitialSchema1783706620726 } from './1783706620726-InitialSchema';
import { AddRefreshTokenHash1783709002322 } from './1783709002322-AddRefreshTokenHash';

type QueryRunnerMock = QueryRunner & {
  query: jest.Mock<Promise<unknown>, [string]>;
};

function createQueryRunnerMock() {
  return {
    query: jest.fn<Promise<unknown>, [string]>().mockResolvedValue(undefined),
  } as unknown as QueryRunnerMock;
}

describe('database migrations', () => {
  it('creates the core tables, booking constraints, indexes, and foreign key', async () => {
    const migration = new InitialSchema1783706620726();
    const queryRunner = createQueryRunnerMock();

    await migration.up(queryRunner);

    const sql = queryRunner.query.mock.calls
      .map(([statement]) => statement)
      .join('\n');

    expect(sql).toContain('CREATE TABLE "users"');
    expect(sql).toContain('UNIQUE ("email")');
    expect(sql).toContain('CREATE TABLE "services"');
    expect(sql).toContain('CREATE TYPE "public"."bookings_status_enum"');
    expect(sql).toContain('CREATE TABLE "bookings"');
    expect(sql).toContain('CONSTRAINT "UQ_booking_service_date_time" UNIQUE');
    expect(sql).toContain('ON "bookings" ("customer_email")');
    expect(sql).toContain('ON "bookings" ("service_id")');
    expect(sql).toContain('ON "bookings" ("booking_date")');
    expect(sql).toContain('ON "bookings" ("status")');
    expect(sql).toContain(
      'FOREIGN KEY ("service_id") REFERENCES "services"("id")',
    );
  });

  it('drops schema objects in reverse dependency order', async () => {
    const migration = new InitialSchema1783706620726();
    const queryRunner = createQueryRunnerMock();

    await migration.down(queryRunner);

    expect(
      queryRunner.query.mock.calls.map(([statement]) => statement),
    ).toEqual([
      expect.stringContaining(
        'DROP CONSTRAINT "FK_df22e2beaabc33a432b4f65e3c2"',
      ),
      expect.stringContaining(
        'DROP INDEX "public"."IDX_48b267d894e32a25ebde4b207a"',
      ),
      expect.stringContaining(
        'DROP INDEX "public"."IDX_0b43f68def0b753efccd9aa68c"',
      ),
      expect.stringContaining(
        'DROP INDEX "public"."IDX_df22e2beaabc33a432b4f65e3c"',
      ),
      expect.stringContaining(
        'DROP INDEX "public"."IDX_b8ca4fb605f5492daaf82cbffd"',
      ),
      expect.stringContaining('DROP TABLE "bookings"'),
      expect.stringContaining('DROP TYPE "public"."bookings_status_enum"'),
      expect.stringContaining('DROP TABLE "services"'),
      expect.stringContaining('DROP TABLE "users"'),
    ]);
  });

  it('adds and removes nullable refresh token hash storage', async () => {
    const migration = new AddRefreshTokenHash1783709002322();
    const queryRunner = createQueryRunnerMock();

    await migration.up(queryRunner);
    await migration.down(queryRunner);

    expect(
      queryRunner.query.mock.calls.map(([statement]) => statement),
    ).toEqual([
      'ALTER TABLE "users" ADD "refresh_token_hash" character varying',
      'ALTER TABLE "users" DROP COLUMN "refresh_token_hash"',
    ]);
  });
});
