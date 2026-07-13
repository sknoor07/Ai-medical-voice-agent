"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Stethoscope } from "lucide-react";
import HistoryList from "./_components/HistoryList";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import DoctorAgentlist from "./_components/DoctorAgentlist";
import { ThreeBackground } from "./_components/ThreeBackground";


function Dashboard() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <ThreeBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Conversations
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              View and manage all your AI medical consultations
            </p>
          </div>
          <AddNewSessionDialog />
        </motion.div>

        

        <HistoryList />
        <DoctorAgentlist />
      </div>
    </div>
  );
}

export default Dashboard;