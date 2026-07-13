"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import { motion } from "framer-motion";
import { Clock, FileText } from "lucide-react";

function HistoryList() {
  const [historyList, setHistoryList] = useState<sessionDetail[]>([]);

  const getHistoryList = async () => {
    const result = await axios.get("/api/session_chat", {
      params: { sessionId: "all" },
    });
    console.log("history: ", result.data);
    setHistoryList(result.data);
  };

  useEffect(() => {
    getHistoryList();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold">Recent History</h2>
        </div>
        <span className="text-sm text-gray-500">
          {historyList.length} consultations
        </span>
      </div>

      {historyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-[#111118]/80 border border-gray-800 border-dashed backdrop-blur-sm">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-cyan-400/60" />
          </div>
          <h2 className="font-bold text-xl text-gray-300 mb-2">
            No Recent Conversations
          </h2>
          <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
            Your consultation history will appear here. Start your first AI medical consultation to see it here.
          </p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div className="rounded-3xl bg-[#111118]/80 border border-gray-800 backdrop-blur-sm overflow-hidden">
          <HistoryTable allHistoryList={historyList} />
        </div>
      )}
    </motion.div>
  );
}

export default HistoryList;