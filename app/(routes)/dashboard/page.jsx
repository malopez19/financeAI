"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";

function Dashboard() {
  const { user } = useUser();
  const [cashList, setCashList] = useState([]);

  useEffect(() => {
    user && getCashList();
  }, [user]);

  /**
   * Obtener la lista de dineros a través de la API
   */
  const getCashList = async () => {
    try {
      const response = await fetch(`/api/cash-in`, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Error al obtener la lista de dineros`);
      }

      const data = await response.json();
      setCashList(data);
    } catch (error) {
      console.error("Error al obtener la lista de dineros:", error);
    }
  };

  /**
   * componente que muestra la informacion de los ingresos
   */

  return (
    <div className="p-8 bg-">
      <h2 className="font-bold text-4xl">Hola, {user?.fullName} 👋</h2>
      <p className="text-gray-500">
        Que esta pasando con tu dinero, administra tus finanzas.
      </p>

      <CardInfo cashList={cashList}/>
    </div>
  );
}

export default Dashboard;
