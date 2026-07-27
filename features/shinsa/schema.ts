import { relations } from "drizzle-orm";
import {
  pgTable,
  text, timestamp, uuid,
  varchar, integer, decimal, primaryKey
} from "drizzle-orm/pg-core";

export const shinsas = pgTable("shinsas", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: integer("type"),
  location: text("location"),
  deliveryMethodType: integer("delivery_method_type"),
  startAt: timestamp("start_at", { mode: "string" }),
  note: text("note"),
  federationId: uuid("federation_id"),
  kyudojoId: uuid("kyudojo_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prefectures = pgTable("prefectures", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  nameJa: varchar("name_ja", { length: 100 }).notNull().unique(),
  nameEn: varchar("name_en", { length: 100 }).notNull().unique(),
});

export const regions = pgTable("regions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  nameJa: varchar("name_ja", { length: 100 }).notNull().unique(),
  weight: integer("weight").notNull(),
});

export const federations = pgTable("federations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  prefectureCode: varchar("prefecture_code", { length: 10 }).references(() => prefectures.code),
  regionId: uuid("region_id").references(() => regions.id),
});

export const kyudojos = pgTable("kyudojos", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  prefectureCode: varchar("prefecture_code", { length: 10 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 11, scale: 7 }),
});

export const ranks = pgTable("ranks", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  weight: integer("weight").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
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
