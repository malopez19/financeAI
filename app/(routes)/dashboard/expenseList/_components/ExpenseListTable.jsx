import React from "react";

function ExpenseListTable({ expensesList }) {
  
  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Ultimas Transferencias</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Numero de Cuenta</h2>
        <h2 className="font-bold">Concepto</h2>
        <h2 className="font-bold">Monto</h2>
        <h2 className="font-bold">Fecha</h2>
      </div>

      {expensesList.map((expenses, index) => (
        <div
          className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2"
          key={index}
        >
          <h2>{expenses.accountNumber}</h2>
          <h2>{expenses.name}</h2>
          <h2>${expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
