"use client";

import { PricingTable } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { ThreeBackground } from "../_components/ThreeBackground";

export default function BillingPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <ThreeBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
            Subscription Plans
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Choose the plan that works best for your healthcare needs. Upgrade anytime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl bg-[#111118]/80 border border-gray-800 backdrop-blur-sm p-8"
        >
          <PricingTable />
        </motion.div>
      </div>
    </div>
  );
}