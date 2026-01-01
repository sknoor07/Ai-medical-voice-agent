"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import { Loader2 } from "lucide-react";


export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  subscriptionRequired: boolean;
};

function DoctorAgentCard({
  doctorAgent,
  onSelect,
  selectdoctor,

}: {
  doctorAgent: doctorAgent;
  onSelect?: (d: doctorAgent) => void;
  selectdoctor?: doctorAgent;

}) {
  const [loading, setLoading] = useState(false);
  const {has}= useAuth();
  const paidUser = has?.({ plan: 'pro_user' })
  const router = useRouter();
   const [historyList, setHistoryList] = React.useState<sessionDetail[]>([]);

  async function startConsultation() {
    setLoading(true);
    const res = await axios.post("/api/session_chat", {
      notes: "New Conversation",
      selectedDoctor: doctorAgent,
    });
    router.push("/dashboard/medical-agent/" + res.data[0].sessionId);
    setLoading(false);
  }

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
    <div
      className={`relative p-4 border rounded-2xl hover:border-blue-500 shadow-lg transition-all cursor-pointer ${
        selectdoctor?.id === doctorAgent.id
          ? "border-blue-500 shadow-cyan-500"
          : ""
      }`}
      onClick={() => onSelect?.(doctorAgent)}
    >
      {doctorAgent.subscriptionRequired && (
        <Badge className="absolute right-4 top-4">Premium</Badge>
      )}

      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
        className="w-full h-[250px] object-cover rounded-2xl"
      />

      <h2 className="font-bold text-lg mt-3">{doctorAgent.specialist}</h2>

      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
        {doctorAgent.description}
      </p>

      {(!paidUser&&historyList?.length>=1)?(
        <Button
          className="mt-3 w-full cursor-pointer"
          disabled={true}
          onClick={()=>startConsultation()}
        >
          Consult Now
          {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <IconArrowRight />
              )}
        </Button>
      ):<Button
          className="mt-3 w-full cursor-pointer"
          disabled={!paidUser && doctorAgent.subscriptionRequired}
          onClick={()=>startConsultation()}
        >
          Consult Now
          {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <IconArrowRight />
              )}
        </Button>}
    </div>
  );
}

export default DoctorAgentCard;
