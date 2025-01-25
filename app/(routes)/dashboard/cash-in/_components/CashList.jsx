"use client";
import React, { useEffect, useState } from "react";
import CreateCash from "./CreateCash";
import { useUser } from "@clerk/nextjs";
import CashItem from "./CashItem";

function CashList() {
  const [cashList, setCashList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getCashList();
    }
  }, [user]);

  /**
   * Obtener la lista de dineros a través de la API
   */
  const getCashList = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cash-in`, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Error al obtener la lista de dineros`);
      }

      const data = await response.json();
      setCashList(data);
    } catch (error) {
      console.error("Error al obtener la lista de dineros:", error);
    }
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateCash refreshData={() => getCashList()} />

        {cashList?.length > 0
          ? cashList.map((item) => (
              <CashItem 
                key={item.id}
                totalCash={item.amount} 
                totalSpend={item.totalSpend}
              />
            ))
          : [1, 2, 3, 4, 5].map((_, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default CashList;
