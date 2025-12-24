import React from "react";
import DashboardHeader from "./_components/DashboardHeader";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";

function Dashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            <i className="fas fa-comments mr-2"></i>Your Conversations
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            View and manage all your doctor conversations
          </p>
        </div>
        <Button className=" cursor-pointer">+ Consult with Doctor</Button>
      </div>
      <HistoryList />
    </div>
  );
}
export default Dashboard;
