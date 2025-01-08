"use client";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
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
// import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Cash } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditCash({ cashInfo, refreshData }) {

  const [amount, setAmount] = useState("");

  // const { user } = useUser();

  useEffect(() => {
    if (cashInfo) {
      setAmount(cashInfo.amount);
    }
  }, [cashInfo]);

  const onUpdateCash = async () => {
    const result = await db
      .update(Cash)
      .set({
        amount: amount,
      })
      .where(eq(Cash.id, cashInfo.id))
      .returning();

    if (result) {
      refreshData();
      toast("Bolsillo Actualizado!");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex space-x-2 gap-2 rounded-full">
            {" "}
            <PenBox className="w-4" /> Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Bolsillo</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Monto</h2>
                  <Input
                    type="number"
                    defaultValue={cashInfo?.amount}
                    placeholder="e.g. 50000$"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(amount)}
                onClick={() => onUpdateCash()}
                className="mt-5 w-full rounded-full"
              >
                Actualizar Bolsillo
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditCash;
