import { db } from "@/lib/dbConfig";
import { Expenses } from "@/lib/schema";
import { eq } from "drizzle-orm";
import React from "react";
import { toast } from "sonner";

function ExpenseListTable({ expensesList, refreshData }) {
  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast("Transferencia eliminada!");
      refreshData();
    }
  };
  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Ultimas Transferencias</h2>
      <div className="grid grid-cols-5 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Numero de Cuenta</h2>
        <h2 className="font-bold">Descripcion</h2>
        <h2 className="font-bold">Monto</h2>
        <h2 className="font-bold">Fecha</h2>
        <h2 className="font-bold">Action</h2>
      </div>

      {expensesList.map((expenses, index) => (
        <div
          className="grid grid-cols-5 bg-slate-50 rounded-bl-xl rounded-br-xl p-2"
          key={index}
        >
          <h2>{expenses.accountNumber}</h2>
          <h2>{expenses.name}</h2>
          <h2>${expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2
            onClick={() => deleteExpense(expenses)}
            className="text-red-500 cursor-pointer"
          >
            Delete
          </h2>
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
