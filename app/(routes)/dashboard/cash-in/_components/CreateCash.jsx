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
import { db } from "@/utils/dbConfig";
import { Cash } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function CreateCash({ refreshData }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const { user } = useUser();

  /**
   * Usado para crear nuevo campo de dinero
   */
  const onCreateCash = async () => {
    const result = await db
      .insert(Cash)
      .values({
        amount: amount,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ insertedId: Cash.id });

    if (result) {
      refreshData();
      toast("Nuevo dinero ingresado!");
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
                  {"😀"}
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Monto</h2>
                  <Input
                    type="number"
                    placeholder="e.g. $10000"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!( amount)}
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
