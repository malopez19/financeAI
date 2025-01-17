"use client";
import formatNumber from "@/lib";
import React from "react";

function TotalIncome({ incomelist, totalSpend }) {
  const totalIncome = incomelist.reduce((acc, income) => acc + income.amount, 0);

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div>
          <h2 className="font-bold text-primary text-lg">Ingresos: ${formatNumber(totalIncome)}</h2>
          <h2 className="font-bold text-primary text-lg">Gastados: ${formatNumber(totalSpend)}</h2>
        </div>
      </div>
    </div>
  );
}

export default TotalIncome;