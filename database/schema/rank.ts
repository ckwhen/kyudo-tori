import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ranksShinsas } from "./shinsa";

export const ranks = pgTable("ranks", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  weight: integer("weight").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull()
});

export const ranksRelations = relations(ranks, ({ many }) => ({
  ranksShinsas: many(ranksShinsas),
}));
