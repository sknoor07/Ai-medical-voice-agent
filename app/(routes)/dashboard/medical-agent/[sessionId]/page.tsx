"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneCallIcon, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Vapi from "@vapi-ai/web";

export type sessionDetail = {
  id: number;
  sessionId: string;
  notes: string;
  selectedDoctor: doctorAgent;
  conversation: "";
  report: JSON;
  createdBy: string;
  createdOn: string;
};

function MedicalAgentSessionPage() {
  const { sessionId } = useParams();
  const [sessionDetails, setSessionDetails] = useState<sessionDetail>();
  const [callStarted, setCallSarted] = useState(false);
  const [callended, setCallEnded] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [liveTranscipt, setLiveTranscript] = useState("");

  const fetchSessionData = async () => {
    const result = await axios.get("/api/session_chat", {
      params: { sessionId: sessionId },
    });
    console.log("Session Data:", result.data);
    setSessionDetails(result.data);
  };

  const handleCallStart = () => {
    console.log("Call started");
    setCallSarted(true);
    setCallEnded(false);
  };

  const handleCallEnd = () => {
    console.log("Call ended");
    setCallSarted(false);
    setCallEnded(true);
  };

  const handleMessage = (message: any) => {
    if (message.type === "transcript") {
      const { role, trascriptType, transcript } = message;
      console.log(`${message.role}: ${message.transcript}`);
      if (trascriptType === "partial") {
        setLiveTranscript(transcript);
        setCurrentRole(role);
      } else {
      }
    }
  };
  const handleSpeechStart = () => {
    console.log("assistance speacking");
    setCurrentRole("assistant");
  };

  const handleSpeechEnd = () => {
    console.log("Assistance Stop Speaking");
    setCurrentRole("user");
  };

  const startCall = () => {
    if (vapiInstance) return; // prevent double start

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapiInstance.on("speech-start", handleSpeechStart);
    vapiInstance.on("speech-", handleSpeechEnd);

    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
    setVapiInstance(vapi);
  };

  const endCall = () => {
    if (!vapiInstance) return;

    vapiInstance.off("call-start", handleCallStart);
    vapiInstance.off("call-end", handleCallEnd);
    vapiInstance.off("message", handleMessage);

    vapiInstance.stop();
    setVapiInstance(null);
    setCallSarted(false);
    setCallEnded(true);
  };

  useEffect(() => {
    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
        vapiInstance.off("call-start", handleCallStart);
        vapiInstance.off("call-end", handleCallEnd);
        vapiInstance.off("message", handleMessage);
      }
    };
  }, [vapiInstance]);

  useEffect(() => {
    if (!sessionId || Array.isArray(sessionId)) return;
    sessionId && fetchSessionData();
  }, [sessionId]);
  return (
    <div className=" p-5 border rounded-3xl bg-secondary transition-all">
      <div className="flex justify-between items-center ">
        <h2 className="p-2 px-2 border rounded-2xl flex gap-2 items-center">
          <Circle
            className={`rounded-full ${
              callStarted ? "bg-green-300" : "bg-red-600"
            }`}
          />
          {callStarted ? "Connected" : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>
      {sessionDetails && (
        <div className="flex flex-col justify-center items-center  mt-5 py-10">
          <Image
            className="h-[130px] w-[130px] object-cover rounded-full"
            src={sessionDetails?.selectedDoctor?.image}
            alt={sessionDetails?.selectedDoctor.specialist}
            width={130}
            height={150}
          />
          <h2 className="mt-4 text-xl">
            {sessionDetails.selectedDoctor.specialist}
          </h2>
          <p className=" text-sm  text-gray-400">AI Medical Voice Agent</p>
          <div className="mt-30">
            <h2 className="text-gray-400"> Assistant Msg...</h2>
            <h2 className="text-lg"> User Msg...</h2>
            {!callStarted ? (
              <Button className=" mt-10 cursor-pointer" onClick={startCall}>
                <PhoneCallIcon />
                Start call
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                className=" mt-10 cursor-pointer"
                onClick={endCall}
              >
                <PhoneOff />
                Disconnect
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default MedicalAgentSessionPage;
