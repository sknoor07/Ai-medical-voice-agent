"use client";

import { AIDoctorAgents } from "@/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

function DoctorAgentlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-violet-400" />
        </div>
        <h2 className="text-xl font-bold">AI Specialist Doctors</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {AIDoctorAgents.map((doctors, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <DoctorAgentCard doctorAgent={doctors} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default DoctorAgentlist;