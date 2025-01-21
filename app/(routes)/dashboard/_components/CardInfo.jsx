import formatNumber from "@/lib";
import {
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function CardInfo({ cashList }) {
  const [totalCash, setTotalCash] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [netCash, setNetCash] = useState(0); 
  

  useEffect(() => {
    if (cashList.length > 0) {
      CalculateCardDisplay();
    }
  }, [cashList]);

  const CalculateCardDisplay = () => {
    let totalCash_ = 0;
    let totalSpend_ = 0;

    cashList.forEach((element) => {
      totalCash_ = totalCash_ + Number(element.amount);
      totalSpend_ = totalSpend_ + element.totalSpend;
    });

    setTotalCash(totalCash_);
    setTotalSpend(totalSpend_);
    setNetCash(totalCash_ - totalSpend_); 
  };

  return (
    <div>
      {cashList?.length > 0 ? (
        <div>
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Dinero Total</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(totalCash)}
                </h2>
              </div>
              <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Gastado</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(totalSpend)}
                </h2>
              </div>
              <ReceiptText className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Dinero Restante</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(netCash)}
                </h2>
              </div>
              <CircleDollarSign className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((_, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;
