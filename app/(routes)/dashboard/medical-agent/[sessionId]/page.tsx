"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import {
  ArrowRight,
  Circle,
  HeartPlus,
  Languages,
  Loader2,
  PhoneCall,
  PhoneCallIcon,
  PhoneOff,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

export type SessionReport = {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string; // ISO date string
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  recommendations: string[];
};

export type sessionDetail = {
  id: number;
  sessionId: string;
  notes: string;
  selectedDoctor: doctorAgent;
  conversation: "";
  report: SessionReport | null;
  createdBy: string;
  createdOn: string;
};

type messages = { role: string; text: string };

function MedicalAgentSessionPage() {
  const { user } = useUser();
  const { sessionId } = useParams();
  const [sessionDetails, setSessionDetails] = useState<sessionDetail>();
  const [callStarted, setCallSarted] = useState(false);
  const [callended, setCallEnded] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscipt, setLiveTranscript] = useState("");
  const [finalMessages, setFinalMessages] = useState<messages[]>([]);
  const [loading, setloading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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
    setloading(false);
    setCallEnded(false);
  };

  const handleCallEnd = () => {
    console.log("Call ended");
    setCallSarted(false);
    setCallEnded(true);
  };

  const handleMessage = (message: any) => {
    if (message.type === "transcript") {
      const { role, transcriptType, transcript } = message;
      console.log(`${message.role}: ${message.transcript}`);
      if (transcriptType == "partial") {
        setLiveTranscript(transcript);
        setCurrentRole(role);
      } else if (transcriptType == "final") {
        setFinalMessages((prev) => [...prev, { role: role, text: transcript }]);
        setLiveTranscript("");
        setCurrentRole(null);
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
    console.log(sessionDetails?.selectedDoctor?.voiceId);

    // if (!sessionDetails?.selectedDoctor?.voiceId) {
    //   console.error("Session not ready");
    //   return;
    // }

    setloading(true);

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

    const voiceAgentConfig = {
      name: "AI Medical Voice Agent",
      firstMessage:
        "Hi there! I'm Your AI Medical Voice assistant. I am here to help you with health questions or conserns you might have today.How are you feeling today?",
      transcriber: { provider: "assembly-ai", language: "en" },
      voice: {
        provider: "vapi",
        voiceId: sessionDetails?.selectedDoctor?.voiceId,
      },

      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetails?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);

    vapi.on("error", (err) => {
      console.error("Vapi error:", err);
      setloading(false);
    });

    //@ts-ignore
    vapi.start(voiceAgentConfig);
    setVapiInstance(vapi);
  };

  const endCall = async () => {
    if (!vapiInstance) return;

    vapiInstance.off("call-start", handleCallStart);
    vapiInstance.off("call-end", handleCallEnd);
    vapiInstance.off("message", handleMessage);
    vapiInstance.off("speech-start", handleSpeechStart);
    vapiInstance.off("speech-end", handleSpeechEnd);

    vapiInstance.stop();
    setVapiInstance(null);
    setCallSarted(false);
    setCallEnded(true);
    const result = await generateReport();
    setloading(false);
    toast.success("Your Report Generated Successfully");
    router.replace("/dashboard");
  };

  const generateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      messages: finalMessages,
      sessioninfo: sessionDetails,
      sessionid: sessionId,
      username: user?.username,
    });
    console.log("report data: ", result.data);
    return result.data;
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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [finalMessages, liveTranscipt]);

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
          <div className="mt-6 max-h-[200px] overflow-y-auto flex flex-col items-center gap-2">
            <div className="flex flex-col items-center px-10">
              {finalMessages.map((message, index) => (
                <div
                  key={index}
                  className="max-w-[90%] text-center bg-muted px-4 py-2 rounded-xl text-sm"
                >
                  <span className="block font-semibold capitalize mb-1">
                    {message.role}
                  </span>
                  <span>{message.text}</span>
                </div>
              ))}
              {/* Scroll anchor */}
            </div>

            {liveTranscipt && (
              <div className="max-w-[90%] text-center bg-primary/10 px-4 py-2 rounded-xl">
                <span className="block font-semibold capitalize mb-1">
                  {currentRole}
                </span>
                <span>{liveTranscipt}</span>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <div>
            {!callStarted ? (
              <Button
                className=" mt-10 cursor-pointer "
                onClick={startCall}
                disabled={loading}
              >
                <PhoneCallIcon />
                Start call
                {!loading ? (
                  <ArrowRight />
                ) : (
                  <Loader2 className="animate-spin" />
                )}
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                className=" mt-10 cursor-pointer"
                onClick={endCall}
                disabled={loading}
              >
                <PhoneOff />
                Disconnect
                {!loading ? (
                  <ArrowRight />
                ) : (
                  <Loader2 className="animate-spin" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default MedicalAgentSessionPage;
