"use client";

import { UserButton } from "@clerk/nextjs";
import { MessageSquare, History, CreditCard, User, Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function DashboardHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const options = [
    { id: 1, name: "Home", path: "/dashboard", icon: Home },
    { id: 2, name: "History", path: "/dashboard/history", icon: History },
    { id: 3, name: "Pricing", path: "/dashboard/billing", icon: CreditCard },
    { id: 4, name: "Profile", path: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-gray-800/50 backdrop-blur-xl bg-[#0a0a0f]/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
            MedVoice AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {options.map((option) => {
            const isActive = pathname === option.path;
            const Icon = option.icon;
            return (
              <Link
                key={option.id}
                href={option.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "text-white bg-gray-800/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.name}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-400"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-gray-700 flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7",
                },
              }}
            />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 rounded-2xl border border-gray-800/80 bg-[#111118]/90 p-3 space-y-2">
          {options.map((option) => {
            const isActive = pathname === option.path;
            const Icon = option.icon;
            return (
              <Link
                key={option.id}
                href={option.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gray-800/70 text-white"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DashboardHeader;