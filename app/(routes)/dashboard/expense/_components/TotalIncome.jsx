"use client";
import formatNumber from "@/lib";
import React, { useEffect, useState } from "react";

function TotalIncome({ cashList, incomeList }) {
  const [totalSpend, setTotalSpend] = useState(0);
  

  useEffect(() => {
    if (cashList.length > 0 || incomeList.length > 0) {
      CalculateCardInfo();
    }
  }, [cashList, incomeList]);

  const CalculateCardInfo = () => {
    let totalCash_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;

    if (incomeList) {
      incomeList.forEach((element) => {
        totalIncome_ = totalIncome_ + element.totalAmountIncome;
      });
    }

    if (cashList) {
      cashList.forEach((element) => {
        totalCash_ = totalCash_ + Number(element.amount);
        totalSpend_ = totalSpend_ + element.totalSpend;
      });
    }

    setTotalSpend(totalCash_ - totalSpend_);
  };

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div>
          <h2 className="font-bold text-primary text-lg">Gastados: ${formatNumber(totalSpend)}</h2>
        </div>
      </div>
    </div>
  );
}

export default TotalIncome;