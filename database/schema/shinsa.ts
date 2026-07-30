import { relations } from "drizzle-orm";
import {
  pgTable,
  unique, index, primaryKey,
  text, timestamp, uuid,
  varchar, integer
} from "drizzle-orm/pg-core";
import { ranks } from "./rank";
import { federations } from "./federation";
import { kyudojos } from "./kyudojo";

export const shinsas = pgTable("shinsas", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: integer("type").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  deliveryMethodType: integer("delivery_method_type").notNull(),
  startAt: timestamp("start_at", { mode: "string" }),
  note: text("note"),
  federationId: uuid("federation_id")
    .references(() => federations.id, { onDelete: 'set null' }),
  kyudojoId: uuid("kyudojo_id")
    .references(() => kyudojos.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  {
    uniqueShinsa: unique("unique_shinsa").on(table.name, table.location, table.startAt),
  },
  {
    idxShinsasFederationId: index("idx_shinsas_federation_id").on(table.federationId),
  },
  {
    idxShinsasKyudojoId: index("idx_shinsas_kyudojo_id").on(table.kyudojoId),
  }
]);

export const ranksShinsas = pgTable("ranks_shinsas", {
  shinsaId: uuid("shinsa_id")
    .notNull()
    .references(() => shinsas.id, { onDelete: 'cascade' }),
  rankId: uuid("rank_id")
    .notNull()
    .references(() => ranks.id),
}, (table) => [
  {
    pk: primaryKey({ columns: [ table.shinsaId, table.rankId ] }),
  }
]);

export const shinsasRelations = relations(shinsas, ({ many, one }) => ({
  ranksShinsas: many(ranksShinsas),
  federation: one(federations, {
    fields: [shinsas.federationId],
    references: [federations.id],
  }),
  kyudojo: one(kyudojos, {
    fields: [shinsas.kyudojoId],
    references: [kyudojos.id],
  }),
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
