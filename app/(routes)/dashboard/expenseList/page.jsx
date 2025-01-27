"use client";
import { db } from "@/lib/dbConfig";
import { Cash, Expenses } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);
  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    try {
      const response = await fetch("/api/all-expenses", { method: "GET" });

      if (!response.ok) {
        throw new Error("Error al obtener los gastos");
      }

      const result = await response.json();
      setExpensesList(result);
    } catch (error) {
      console.error("Error al obtener los gastos:", error.message);
    }
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
