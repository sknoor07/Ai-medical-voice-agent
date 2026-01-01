"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

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
  startconversation,
  selectdoctor,
}: {
  doctorAgent: doctorAgent;
  onSelect?: (d: doctorAgent) => void;
  startconversation?: () => void;
  selectdoctor?: doctorAgent;
}) {
  const {has}= useAuth();
  const paidUser = has?.({ plan: 'pro_user' })
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

      {(
        <Button
          className="mt-3 w-full cursor-pointer"
          onClick={() => startconversation?.()}
          disabled={!paidUser && doctorAgent.subscriptionRequired}
        >
          Consult Now
          <IconArrowRight />
        </Button>
      )}
    </div>
  );
}

export default DoctorAgentCard;
