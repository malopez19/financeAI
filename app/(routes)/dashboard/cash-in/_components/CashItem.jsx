import Link from "next/link";
import React from "react";

function CashItem({ cash }) {
  const calculateProgressPerc = () => {
    const perc = (cash.totalSpend / cash.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };
  return (
    <Link href={"/dashboard/expenseList/" + cash?.id}>
      <div
        className="p-5 border rounded-2xl
        hover:shadow-md cursor-pointer h-[170px]"
      >
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2
              className="text-2xl p-3 px-4
              bg-slate-100 rounded-full 
              "
            >
              {cash?.icon}
            </h2>
            <div>
              <h2 className="font-bold">{cash.name}</h2>
              <h2 className="text-sm text-gray-500">{cash.totalItem} Gastos</h2>
            </div>
          </div>
          <h2 className="font-bold text-primary text-lg"> ${cash.amount}</h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">
              ${cash.totalSpend ? cash.totalSpend : 0} Gastado
            </h2>
            <h2 className="text-xs text-slate-400">
              ${cash.amount - cash.totalSpend} Restante
            </h2>
          </div>
          <div
            className="w-full
              bg-slate-300 h-2 rounded-full"
          >
            <div
              className="
              bg-primary h-2 rounded-full"
              style={{
                width: `${calculateProgressPerc()}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CashItem;
