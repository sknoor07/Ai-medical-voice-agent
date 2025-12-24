import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { ArrowBigRight } from "lucide-react";
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

function DoctorAgentCard({ doctorAgent }: { doctorAgent: doctorAgent }) {
  return (
    <div className=" p-4 border rounded-2xl shadow-md">
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
        className=" w-full h-[250px] object-cover rounded-2xl"
      />
      <h2 className="font-bold text-lg mt-3">{doctorAgent.specialist}</h2>
      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
        {doctorAgent.description}
      </p>
      <Button className="mt-3 w-full cursor-pointer">
        Consult Now
        <IconArrowRight />
      </Button>
    </div>
  );
}

export default DoctorAgentCard;
