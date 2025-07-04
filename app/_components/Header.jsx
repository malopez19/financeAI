"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import logo from "@/public/logo.svg";

function Header() {
  const { isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center shadow-sm bg-[#27445d]">
      <div className="flex flex-row items-center">
        <Image src={logo} alt="logo" width={40} height={25} />
        <span className="text-neutral-50 text-opacity-100 font-bold text-xl ml-2">Qoin </span>
      </div>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="flex gap-3  items-center ">
          <Link href={"/sign-in"}>
            <Button className="bg-[#f26b0f] hover:bg-[#f26a0fcc] rounded-full">Empezar</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
