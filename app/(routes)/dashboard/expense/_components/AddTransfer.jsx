import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function AddTransfer({ cashId, totalCash, totalSpend, refreshData }) {
  const [accountNumber, setAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Usado para agregar nuevo gasto
   */
  const addNewTransfer = async () => {
    const remainingCash = totalCash - totalSpend;

    if (parseFloat(amount) <= 0) {
      toast.error("El monto ingresado debe ser mayor a 0.");
      return;
    }

    if (parseFloat(amount) > totalCash) {
      toast.error("El monto ingresado es mayor que el dinero total disponible.");
      return;
    }

    if (parseFloat(amount) > remainingCash) {
      toast.error("El monto ingresado es mayor al dinero restante.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountNumber, description, amount, cashId, totalCash, totalSpend }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al procesar la solicitud: ${errorText}`);
      }

      const result = await response.json();
      setAmount("");
      setDescription("");
      setAccountNumber("");
      refreshData();
      toast("Nueva transferencia enviada!");
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
      toast("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Agregar Transferencia</h2>
      <div className="mt-2">
        <div className="text-black font-medium my-1">Numero de cuenta</div>
        <Input
          placeholder="e.g. 62315975"
          type="number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <div className="text-black font-medium my-1">Concepto</div>
        <Input
          placeholder="e.g. Gasto en comida"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <div className="text-black font-medium my-1">Monto a Enviar</div>
        <Input
          placeholder="e.g. 20000"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(accountNumber && amount) || loading}
        onClick={() => addNewTransfer()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Enviar transferencia"}
      </Button>
    </div>
  );
}

export default AddTransfer;
