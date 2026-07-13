"use client";

import React from "react";
import HistoryList from "../_components/HistoryList";
import { ThreeBackground } from "../_components/ThreeBackground";
import { motion } from "framer-motion";
import { History } from "lucide-react";

function HistoryPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <ThreeBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Consultation History
            </h1>
            <p className="text-gray-500 text-sm">
              View all your past AI medical consultations
            </p>
          </div>
        </motion.div>
        <HistoryList />
      </div>
    </div>
  );
}

export default HistoryPage;