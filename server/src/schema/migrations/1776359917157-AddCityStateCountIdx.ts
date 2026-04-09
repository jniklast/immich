import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE INDEX "IDX_asset_exif_city_state_asset_id_count" ON "asset_exif" ("city", "state", "assetId") WHERE "city" IS NOT NULL;`.execute(db);
  await sql`INSERT INTO "migration_overrides" ("name", "value") VALUES ('index_IDX_asset_exif_city_state_asset_id_count', '{"type":"index","name":"IDX_asset_exif_city_state_asset_id_count","sql":"CREATE INDEX \\"IDX_asset_exif_city_state_asset_id_count\\" ON \\"asset_exif\\" (\\"city\\", \\"state\\", \\"assetId\\") WHERE \\"city\\" IS NOT NULL;"}'::jsonb);`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP INDEX "IDX_asset_exif_city_state_asset_id_count";`.execute(db);
  await sql`DELETE FROM "migration_overrides" WHERE "name" = 'index_IDX_asset_exif_city_state_asset_id_count';`.execute(db);
}
