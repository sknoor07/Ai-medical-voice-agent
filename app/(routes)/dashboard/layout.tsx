"use client";

import React from "react";
import DashboardHeader from "./_components/DashboardHeader";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <DashboardHeader />
      <div className="pt-20">{children}</div>
    </div>
  );
}

export default DashboardLayout;