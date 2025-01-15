"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { db } from "@/lib/dbConfig";
import { Cash } from "@/lib/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    user && checkUserCash();
  }, [user]);

  const checkUserCash = async () => {
    const result = await db
      .select()
      .from(Cash)
      .where(eq(Cash.createdBy, user?.primaryEmailAddress?.emailAddress));
      
    if (result?.length == 0) {
      router.replace("/dashboard/cash-in");
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
