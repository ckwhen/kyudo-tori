import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const shinsas = pgTable("shinsas", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type"),
  location: text("location"),
  delivery_method_type: text("delivery_method_type"),
  start_at: timestamp("start_at"),
  note: text("note"),
});
