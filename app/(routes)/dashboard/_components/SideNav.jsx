import React, { useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Panel de Control",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Transferencia",
      icon: CircleDollarSign,
      path: "/dashboard/expense",
    },
    {
      id: 3,
      name: "Ingresar Dinero",
      icon: PiggyBank,
      path: "/dashboard/cash-in",
    },
    {
      id: 4,
      name: "Historial de Transferencias",
      icon: ReceiptText,
      path: "/dashboard/expenseList",
    },
  ];
  const path = usePathname();

  useEffect(() => {
  }, [path]);
  return (
    <div className="h-screen p-5 border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src={"./logo2.svg"} alt="logo" width={30} height={30} style={{width:"auto", height:"auto"}}/>
        <span className="text-blue-800 font-bold text-xl ml-3">FinappIA</span>
      </div>
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-2 items-center
                    text-gray-500 font-medium
                    mb-2
                    p-4 cursor-pointer rounded-full
                    hover:text-primary hover:bg-blue-100
                    ${path == menu.path && "text-primary bg-blue-100"}
                    `}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
