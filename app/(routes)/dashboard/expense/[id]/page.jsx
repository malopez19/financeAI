"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CashItem from "../../cash-in/_components/CashItem";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import AddTransfer from "../_components/AddTransfer";
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


function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [cashInfo, setCashInfo] = useState();
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

    try {
      const response = await fetch(`/api/transfer-id?cashId=${unwrappedParams.id}`, { method: "GET" });

      if (!response.ok) {
        throw new Error("Error al obtener la información del dinero");
      }

      const result = await response.json();
      setCashInfo(result);
    } catch (error) {
      console.error("Error al obtener la información del dinero:", error.message);
    }
  };

  /**
   * Eliminar bolsillo
   */
  const deleteCash = async () => {
    try {
      const response = await fetch("/api/transfer-id", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cashId: unwrappedParams.id }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el bolsillo");
      }

      toast("Bolsillo Eliminado!");
      route.replace("/dashboard/cash-in");
    } catch (error) {
      console.error("Error al eliminar el bolsillo:", error.message);
      toast("Error al eliminar el bolsillo");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          Mis Transferencias
        </span>

        <div className="flex gap-2 items-center">
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
          <CashItem id={cashInfo.id} totalCash={cashInfo.amount} totalSpend={cashInfo.totalSpend}/>
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse"
          ></div>
        )}

        <AddTransfer
          cashId={unwrappedParams?.id}
          totalCash={cashInfo?.amount}
          totalSpend={cashInfo?.totalSpend}
          refreshData={() => getCashInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
