import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const todo = sqliteTable("todo", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
});
