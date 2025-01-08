import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Cash, Expenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpense({ cashId, refreshData }) {
  const [accountNumber, setAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  /**
   * Usado para agregar nuevo gasto
   */
  const addNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        accountNumber: accountNumber,
        name: description,
        amount: amount,
        cashId: cashId,
        createdAt: moment().format("DD/MM/yyy"),
      })
      .returning({ insertedId: Cash.id });

    setAmount("");
    setDescription("");
    setAccountNumber("");

    if (result) {
      setLoading(false);
      refreshData();
      toast("Nueva transferencia enviada!");
    }
    setLoading(false);
  };
  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Agregar Transferencia</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Numero de cuenta</h2>
        <Input
          placeholder="e.g. 123456789"
          type="number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Descripcion</h2>
        <Input
          placeholder="e.g. Gasto en comida"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Monto a Enviar</h2>
        <Input
          placeholder="e.g. 20000"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(accountNumber && amount) || loading}
        onClick={() => addNewExpense()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Enviar transferencia"}
      </Button>
    </div>
  );
}

export default AddExpense;
