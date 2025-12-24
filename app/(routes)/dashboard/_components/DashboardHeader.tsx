import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";
import path from "path";
import React from "react";

function DashboardHeader() {
  const options = [
    { id: 1, name: "Home", path: "/home" },
    { id: 2, name: "History", path: "/history" },
    { id: 3, name: "Pricing", path: "/pricing" },
    { id: 4, name: "Profile", path: "/profile" },
  ];
  return (
    <div className="flex  items-center justify-between px-5 py-4 border-b shadow  md:px-20 lg:px-40">
      <Image src={"/logo.svg"} alt="logo" width={180} height={90} />
      <div className="hidden md:flex gap-12  items-center cursor-pointer">
        {options.map((option, index) => {
          return (
            <div key={index}>
              <h2 className="hover:font-bold font-stretch-50% transition-all">
                {option.name}
              </h2>
            </div>
          );
        })}
      </div>
      <UserButton />
    </div>
  );
}

export default DashboardHeader;
