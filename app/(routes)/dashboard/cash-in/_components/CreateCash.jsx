"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/dbConfig";
import { Cash } from "@/lib/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { eq } from "drizzle-orm";

function CreateCash({ refreshData }) {
  const [amount, setAmount] = useState("");
  const [existingCash, setExistingCash] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkExistingCash();
    }
  }, [user]);

  /**
   * Verificar si ya existe un registro de dinero
   */
  const checkExistingCash = async () => {
    const result = await db
      .select()
      .from(Cash)
      .where(eq(Cash.createdBy, user?.primaryEmailAddress?.emailAddress))
      .limit(1);

    if (result.length > 0) {
      setExistingCash(result[0]);
    }
  };

  /**
   * Usado para crear o actualizar el campo de dinero
   */
  const onCreateCash = async () => {
    if (existingCash) {
      // Actualizar el registro existente
      const newAmount = Number(existingCash.amount) + Number(amount);
      const result = await db
        .update(Cash)
        .set({ amount: newAmount })
        .where(eq(Cash.id, existingCash.id))
        .returning();

      if (result.length > 0) {
        setExistingCash(result[0]);
        refreshData();
        toast("Dinero actualizado!");
      }
    } else {
      // Crear un nuevo registro
      const result = await db
        .insert(Cash)
        .values({
          amount: amount,
          createdBy: user?.primaryEmailAddress?.emailAddress,
        })
        .returning();

      if (result.length > 0) {
        setExistingCash(result[0]);
        refreshData();
        toast("Nuevo dinero ingresado!");
      }
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Recargar</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ingresa el dinero</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <div className="mt-2">
                  <div className="text-black font-medium my-1">Monto</div>
                  <Input
                    type="number"
                    placeholder="e.g. $10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!amount}
                onClick={() => onCreateCash()}
                className="mt-5 w-full rounded-full"
              >
                Recargar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateCash;
