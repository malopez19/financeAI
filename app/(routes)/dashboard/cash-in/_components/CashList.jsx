"use client";
import React, { useEffect, useState } from "react";
import CreateCash from "./CreateCash";
import { db } from "@/lib/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Cash, Expenses } from "@/lib/schema";
import { useUser } from "@clerk/nextjs";
import CashItem from "./CashItem";

function CashList() {
  const [cashList, setCashList] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user && getCashList();
  }, [user]);

  /**
   * Obtener la lista de dinero
   */
  const getCashList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Cash),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Cash)
      .leftJoin(Expenses, eq(Cash.id, Expenses.cashId))
      .where(eq(Cash.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Cash.id)
      .orderBy(desc(Cash.id));
    setCashList(result);
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateCash refreshData={() => getCashList()} />
        {cashList?.length > 0
          ? cashList.map((cash, index) => 
            <CashItem cash={cash} key={index} />
          )
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default CashList;
