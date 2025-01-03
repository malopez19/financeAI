import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const Cash = pgTable("cash", {
  id: serial("id").primaryKey(),
  amount: varchar("amount").notNull(),
  createdBy: varchar("createdBy").notNull(),
});

export const Incomes = pgTable("income", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});
export const Expenses = pgTable("expense", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  cashId: integer("cashId").references(() => Cash.id),
  createdAt: varchar("createdAt").notNull(),
});
