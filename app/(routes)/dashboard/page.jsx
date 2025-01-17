"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { db } from "@/lib/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Cash, Expenses, Incomes } from "@/lib/schema";

function Dashboard() {
  const { user } = useUser();

  const [cashList, setCashList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);

  useEffect(() => {
    user && getCashList();
  }, [user]);

  /**
   * utilizado para obtener Lista de dineros
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
    getIncomeList();
  };

  /**
   * Get Income stream list
   */
  const getIncomeList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalAmountIncome: sql`sum(CAST(${Incomes.amount} AS numeric))`.mapWith(
          Number
        ),
      })
      .from(Incomes)
      .groupBy(Incomes.id); // Assuming you want to group by ID or any other relevant column

    setIncomeList(result);
  };

  return (
    <div className="p-8 bg-">
      <h2 className="font-bold text-4xl">Hola, {user?.fullName} 👋</h2>
      <p className="text-gray-500">
        Que esta pasando con tu dinero, administra tus finanzas.
      </p>

      <CardInfo cashList={cashList} incomeList={incomeList}/>
    </div>
  );
}

export default Dashboard;
