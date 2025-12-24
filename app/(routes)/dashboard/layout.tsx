import React from "react";
import DashboardHeader from "./_components/DashboardHeader";

function DashbaordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DashboardHeader />
      <div className="px-5  py-3.5 md:px-20 lg:px-40">{children}</div>
    </div>
  );
}

export default DashbaordLayout;
