"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center shadow-sm bg-blue-900">
      <div className="flex flex-row items-center">
        <Image src={"/logo.svg"} alt="logo" width={40} height={25} />
        <span className="text-neutral-50 text-opacity-100 font-bold text-xl ml-2">FinappIA</span>
      </div>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="flex gap-3  items-center ">
          <Link href={"/dashboard"}>
            <Button variant="outline" className="rounded-full">
              Ir al Panel
            </Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button className="bg-amber-500 hover:bg-amber-400 rounded-full">Empezar</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
