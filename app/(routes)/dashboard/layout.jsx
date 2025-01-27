"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      checkUserCash();
    }
  }, [user]);

  const checkUserCash = async () => {
    try {
      const response = await fetch("/api/check-user-cash", { method: "GET" });

      if (!response.ok) {
        throw new Error("Error al verificar el cash del usuario");
      }

      const result = await response.json();

      if (result.length === 0) {
        router.replace("/dashboard/cash-in");
      }
    } catch (error) {
      console.error("Error al verificar el cash del usuario:", error.message);
    }
  };
  return (
    <div>
      <div className="fixed md:w-64 hidden md:block ">
        <SideNav />
      </div>
      <div className="md:ml-64 ">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
