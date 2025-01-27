"use client";
import React, { useState } from "react";
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
import { toast } from "sonner";

function CreateCash({ refreshData }) {
  const [amount, setAmount] = useState("");

  /**
   * Usado para crear o actualizar el campo de dinero
   */
  const onCreateCash = async () => {
    try {
      const response = await fetch("/api/cash-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la solicitud");
      }

      const result = await response.json();
      refreshData();
      toast("Dinero actualizado!");
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
      toast("Error al procesar la solicitud");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-200 p-10 rounded-2xl
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
