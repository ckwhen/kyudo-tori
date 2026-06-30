import { relations } from "drizzle-orm";
import {
  pgTable,
  text, timestamp, uuid,
  varchar, integer, primaryKey
} from "drizzle-orm/pg-core";

export const shinsas = pgTable("shinsas", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  type: integer("type"),
  location: text("location"),
  deliveryMethodType: integer("delivery_method_type"),
  startAt: timestamp("start_at"),
  note: text("note"),
});

export const ranks = pgTable("ranks", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  weight: integer("weight").notNull(),
  type: integer("type").notNull(),
});

export const ranksShinsas = pgTable("ranks_shinsas", {
  shinsaId: uuid("shinsa_id")
    .notNull()
    .references(() => shinsas.id, { onDelete: 'cascade' }),
  rankId: uuid("rank_id")
    .notNull()
    .references(() => ranks.id),
}, (table) => [
  {
    pk: primaryKey({ columns: [table.shinsaId, table.rankId] }),
  }
]);

export const shinsasRelations = relations(shinsas, ({ many }) => ({
  ranksShinsas: many(ranksShinsas),
}));

export const ranksRelations = relations(ranks, ({ many }) => ({
  ranksShinsas: many(ranksShinsas),
}));

export const ranksShinsasRelations = relations(ranksShinsas, ({ one }) => ({
  shinsa: one(shinsas, {
    fields: [ranksShinsas.shinsaId],
    references: [shinsas.id],
  }),
  rank: one(ranks, {
    fields: [ranksShinsas.rankId],
    references: [ranks.id],
  }),
}));
