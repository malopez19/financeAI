import React from "react";
import formatNumber from "@/lib";

function CashItem({ totalCash, totalSpend }) {
  const calculateProgressPerc = () => {
    const perc = (totalSpend / totalCash) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  return (
    <div className="p-5 border rounded-2xl h-[200px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            💰
          </h2>
          <div>
            <h3 className="font-bold">Dinero Total:</h3>
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg">${formatNumber(totalCash)}</h2>
      </div>

      <div className="mt-14">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm text-slate-400">
            ${totalSpend ? totalSpend : 0} Gastado
          </h2>
          <h2 className="text-sm text-slate-400">
            ${totalCash - totalSpend} Restante
          </h2>
        </div>
        <div className="w-full bg-slate-300 h-2 rounded-full">
          <div
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${calculateProgressPerc()}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default CashItem;
