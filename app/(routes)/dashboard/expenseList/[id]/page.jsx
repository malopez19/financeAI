"use client";
import { db } from "@/utils/dbConfig";
import { Cash, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CashItem from "../../cash-in/_components/CashItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditCash from "../_components/EditCash";

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [cashInfo, setcashInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const [unwrappedParams, setUnwrappedParams] = useState(null);
  const route = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => {
      setUnwrappedParams(resolvedParams);
    });
  }, [params]);

  useEffect(() => {
    if (user && unwrappedParams) {
      getCashInfo();
    }
  }, [user, unwrappedParams]);

  /**
   * Obtener informacion del dinero total
   */
  const getCashInfo = async () => {
    if (!unwrappedParams) return;
    
    const result = await db
      .select({
        ...getTableColumns(Cash),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Cash)
      .leftJoin(Expenses, eq(Cash.id, Expenses.cashId))
      .where(eq(Cash.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Cash.id, unwrappedParams.id))
      .groupBy(Cash.id);

    setcashInfo(result[0]);
    getExpensesList();
  };

  /**
   * Obtener ultimas transferencias
   */
  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.cashId, unwrappedParams.id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
    console.log(result);
  };

  /**
   * Eliminar bolsillo
   */
  const deleteCash = async () => {
    const deleteExpenseResult = await db
      .delete(Expenses)
      .where(eq(Expenses.cashId, unwrappedParams.id))
      .returning();

    if (deleteExpenseResult) {
      const result = await db
        .delete(Cash)
        .where(eq(Cash.id, unwrappedParams.id))
        .returning();
    }
    toast("Bolsillo Eliminado!");
    route.replace("/dashboard/cash-in");
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          Mis Transferencias
        </span>

        <div className="flex gap-2 items-center">
          <EditCash cashInfo={cashInfo} refreshData={() => getCashInfo()} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 rounded-full" variant="destructive">
                <Trash className="w-4" /> Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estas completamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente
                  su efectivo actual junto con los gastos y eliminará sus datos
                  de nuestros servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteCash()}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>

      <div
        className="grid grid-cols-1 
        md:grid-cols-2 mt-6 gap-5"
      >
        {cashInfo ? (
          <CashItem cash={cashInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse"
          ></div>
        )}

        <AddExpense
          cashId={unwrappedParams?.id}
          user={user}
          refreshData={() => getCashInfo()}
        />
      </div>
      <div className="mt-4">
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={() => getCashInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
