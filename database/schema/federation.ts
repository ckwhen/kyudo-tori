import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { regions, prefectures } from './region';

export const federations = pgTable("federations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  prefectureCode: varchar("prefecture_code", { length: 10 })
    .references(() => prefectures.code, { onDelete: 'set null' }),
  regionId: uuid("region_id")
    .references(() => regions.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  {
    idxFederationsPrefectureCode: index("idx_federations_prefecture_code").on(table.prefectureCode),
  },
  {
    idxFederationsRegionId: index("idx_federations_region_id").on(table.regionId),
  }
]);
