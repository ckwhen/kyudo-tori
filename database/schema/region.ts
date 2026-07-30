import { pgTable, uuid, varchar, integer, index, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const regions = pgTable("regions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  nameJa: varchar("name_ja", { length: 100 }).notNull().unique(),
  weight: integer("weight").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull()
});

export const prefectures = pgTable("prefectures", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  nameJa: varchar("name_ja", { length: 100 }).notNull().unique(),
  nameEn: varchar("name_en", { length: 100 }).notNull().unique(),
  regionId: uuid("region_id")
    .references(() => regions.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull()
}, (table) => [
  {
    idx: index("idx_prefectures_region_id").on(table.regionId),
  }
]);

export const regionsRelations = relations(regions, ({ many }) => ({
  prefectures: many(prefectures),
}));

export const prefecturesRelations = relations(prefectures, ({ one }) => ({
  region: one(regions, {
    fields: [prefectures.regionId],
    references: [regions.id],
  }),
}));