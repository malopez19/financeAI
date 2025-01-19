import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const Cash = pgTable("cash", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull().default(0),
  createdBy: varchar("createdBy").notNull(),
});

export const Incomes = pgTable("income", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Expenses = pgTable("expense", {
  id: serial("id").primaryKey(),
  accountNumber: numeric("accountNumber").notNull(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  cashId: integer("cashId").references(() => Cash.id),
  createdAt: varchar("createdAt").notNull(),
});
