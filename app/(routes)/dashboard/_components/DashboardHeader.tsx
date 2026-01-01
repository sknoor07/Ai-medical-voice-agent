import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import React from "react";

function DashboardHeader() {
  const options = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "History", path: "/dashboard/history" },
    { id: 3, name: "Pricing", path: "/dashboard/billing" },
    { id: 4, name: "Profile", path: "/dashboard/profile" },
  ];
  return (
    <div className="flex  items-center justify-between px-5 py-4 border-b shadow  md:px-20 lg:px-40">
      <Image src={"/logo.svg"} alt="logo" width={180} height={90} />
      <div className="hidden md:flex gap-12  items-center cursor-pointer">
        {options.map((option, index) => {
          return (
            <div key={index}>
              <Link
                key={option.id}
                href={option.path}
                className="cursor-pointer hover:font-bold transition-all"
              >
                {option.name}
              </Link>
            </div>
          );
        })}
      </div>
      <UserButton />
    </div>
  );
}

export default DashboardHeader;
