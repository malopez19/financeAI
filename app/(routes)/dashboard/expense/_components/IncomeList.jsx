"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { db } from "@/lib/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Incomes, Expenses, Cash } from "@/lib/schema";
import { useUser } from "@clerk/nextjs";
import TotalIncome from "./TotalIncome";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const [cashList, setCashList] = useState([]);
  
  const { user } = useUser();
  useEffect(() => {
    user && getCashList();
  }, [user]);

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
    getIncomeList();
  };

  const getIncomeList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.cashId))
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));

    setIncomelist(result);
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateIncomes refreshData={() => getIncomeList()} />

        {incomelist?.length > 0
          ? <TotalIncome cashList={cashList} incomelist={incomelist}/>
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

export default IncomeList;