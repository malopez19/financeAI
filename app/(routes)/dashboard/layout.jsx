"use client";
import React, { useEffect, useState } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isSideNavVisible, setSideNavVisible] = useState(false);

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

  const toggleSideNav = () => {
    setSideNavVisible(!isSideNavVisible);
  };

  useEffect(() => {
    setSideNavVisible(false);
  }, [pathname]);

  return (
    <div>
      <div className={`fixed md:w-64 ${isSideNavVisible ? 'block bg-slate-100' : 'hidden'} sm:block`} >
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashboardHeader toggleSideNav={toggleSideNav}/>
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
