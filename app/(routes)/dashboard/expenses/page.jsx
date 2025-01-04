"use client";
import { db } from "@/utils/dbConfig";
import { Cash, Expenses } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getAllExpenses();
  }, [user]);
  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Cash)
      .rightJoin(Expenses, eq(Cash.id, Expenses.cashId))
      .where(eq(Cash.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
  };
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">Mis Transferencias</h2>
      <ExpenseListTable
        refreshData={() => getAllExpenses()}
        expensesList={expensesList}
      />
    </div>
  );
}

export default ExpensesScreen;
