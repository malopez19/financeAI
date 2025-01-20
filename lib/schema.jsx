import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const Cash = pgTable("cash", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull().default(0),
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
