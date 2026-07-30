import { pgTable, uuid, varchar, decimal, index, timestamp } from "drizzle-orm/pg-core";
import { prefectures } from './region';

export const kyudojos = pgTable("kyudojos", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  prefectureCode: varchar("prefecture_code", { length: 10 })
    .references(() => prefectures.code, { onDelete: 'set null' }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 11, scale: 7 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  {
    idx: index("idx_kyudojos_prefecture_code").on(table.prefectureCode),
  }
]);
