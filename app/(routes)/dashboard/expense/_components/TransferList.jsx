"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import TransferItem from "./TransferItem";

function TransferList() {
  const [cashList, setCashList] = useState([]);
  const [totalCash, setTotalCash] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getCashList();
    }
  }, [user]);

  const getCashList = async () => {
    try {
      const response = await fetch("/api/transfer", { method: "GET" });

      if (!response.ok) {
        throw new Error("Error al obtener la lista de transferencias");
      }

      const result = await response.json();
      setCashList(result);

      const totalCashAmount = result.reduce((acc, cash) => acc + Number(cash.amount), 0);
      const totalSpendAmount = result.reduce((acc, cash) => acc + cash.totalSpend, 0);

      setTotalCash(totalCashAmount);
      setTotalSpend(totalSpendAmount);
    } catch (error) {
      console.error("Error al obtener la lista de transferencias:", error.message);
    }
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cashList?.length > 0
          ? <TransferItem id={cashList[0].id} totalCash={totalCash} totalSpend={totalSpend} />
          : [1, 2, 3, 4, 5].map((_, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              >
              </div>
            ))}
      </div>
    </div>
  );
}

export default TransferList;
