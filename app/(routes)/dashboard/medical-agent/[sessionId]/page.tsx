"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import {
  ArrowRight,
  Circle,
  Loader2,
  PhoneCall,
  PhoneOff,
  Mic,
  Volume2,
  User,
  Bot,
  Clock,
  Activity,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

// ─── Types (unchanged) ──────────────────────────────────────────────
export type SessionReport = {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string;
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

// ─── Three.js Voice Wave Component ───────────────────────────────────
function VoiceWaveVisualizer({ isActive, role }: { isActive: boolean; role: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const barsRef = useRef<number[]>([]);
  const targetBarsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barCount = 64;
    const barWidth = 3;
    const gap = 2;
    
    if (barsRef.current.length === 0) {
      barsRef.current = new Array(barCount).fill(0.1);
      targetBarsRef.current = new Array(barCount).fill(0.1);
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const getGradient = (height: number, maxHeight: number) => {
      const ratio = height / maxHeight;
      if (role === "assistant") {
        return `rgba(6, 182, 212, ${0.3 + ratio * 0.7})`; // cyan for AI
      } else if (role === "user") {
        return `rgba(139, 92, 246, ${0.3 + ratio * 0.7})`; // violet for user
      }
      return `rgba(6, 182, 212, ${0.2 + ratio * 0.5})`; // default cyan
    };

    const draw = (time: number) => {
      frameRef.current = requestAnimationFrame(draw);
      
      // Frame rate cap at 60fps
      const delta = time - lastTimeRef.current;
      if (delta < 16.67) return;
      lastTimeRef.current = time;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;
      const maxBarHeight = height * 0.45;

      ctx.clearRect(0, 0, width, height);

      // Update target values
      for (let i = 0; i < barCount; i++) {
        if (isActive) {
          // Smooth random movement based on role
          const intensity = role === "assistant" ? 0.8 : role === "user" ? 0.9 : 0.3;
          targetBarsRef.current[i] = 0.05 + Math.random() * intensity;
        } else {
          targetBarsRef.current[i] = 0.05 + Math.sin(time * 0.001 + i * 0.2) * 0.05;
        }
        // Smooth interpolation
        barsRef.current[i] += (targetBarsRef.current[i] - barsRef.current[i]) * 0.15;
      }

      const totalWidth = barCount * (barWidth + gap);
      const startX = (width - totalWidth) / 2;

      for (let i = 0; i < barCount; i++) {
        const barHeight = barsRef.current[i] * maxBarHeight;
        const x = startX + i * (barWidth + gap);
        
        ctx.fillStyle = getGradient(barHeight, maxBarHeight);
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    frameRef.current = requestAnimationFrame(draw);

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, role]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32 md:h-40"
      style={{ willChange: "transform" }}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────
function MedicalAgentSessionPage() {
  const { user } = useUser();
  const { sessionId } = useParams();
  const router = useRouter();

  const [sessionDetails, setSessionDetails] = useState<sessionDetail>();
  const [callStarted, setCallSarted] = useState(false);
  const [callended, setCallEnded] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscipt, setLiveTranscript] = useState("");
  const [finalMessages, setFinalMessages] = useState<messages[]>([]);
  const callHasStartedRef = useRef(false);
  const [loading, setloading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // ─── All original logic preserved exactly ──────────────────────────
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
    callHasStartedRef.current = true;
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
    if (vapiInstance) return;
    console.log(sessionDetails?.selectedDoctor?.voiceId);
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

    // @ts-ignore
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
    
    if (callStarted) {
      const result = await generateReport();
      toast.success("Your Report Generated Successfully");
      router.replace("/dashboard");
    }
    setloading(false);
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
    
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }

    sessionId && fetchSessionData();

    return () => {
      if (!callHasStartedRef.current) {
        cleanupTimerRef.current = setTimeout(() => {
          axios.delete(`/api/session_chat?sessionId=${sessionId}`).catch(e => console.error("Cleanup failed", e));
        }, 1000);
      }
    };
  }, [sessionId]);

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-4 border-b border-gray-800/50 backdrop-blur-xl bg-[#0a0a0f]/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700/50">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400 font-mono">00:00</span>
            </div>
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Status Bar */}
        <div className="flex items-center justify-center mb-8">
          <div 
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all duration-500 ${
              callStarted 
                ? "bg-green-500/10 border-green-500/20 text-green-400 shadow-lg shadow-green-500/10" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <span className={`relative flex h-2.5 w-2.5 ${callStarted ? "" : "hidden"}`}>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <Circle 
              className={`w-2.5 h-2.5 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"}`} 
              fill={callStarted ? "#22c55e" : "#ef4444"}
            />
            <span className="text-sm font-medium tracking-wide">
              {callStarted ? "Session Active" : callended ? "Session Ended" : "Ready to Connect"}
            </span>
          </div>
        </div>

        {sessionDetails && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Doctor Profile & Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Doctor Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative bg-[#111118]/90 border border-gray-800 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className={`absolute -inset-1 rounded-full blur-md transition-all duration-500 ${
                        callStarted ? "bg-cyan-500/30 scale-110" : "bg-gray-500/10 scale-100"
                      }`} />
                      <Image
                        className="relative w-28 h-28 object-cover rounded-full border-2 border-gray-700"
                        src={sessionDetails?.selectedDoctor?.image}
                        alt={sessionDetails?.selectedDoctor?.specialist}
                        width={112}
                        height={112}
                        priority
                      />
                      {callStarted && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#111118] flex items-center justify-center">
                          <Activity className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white">
                      {sessionDetails.selectedDoctor.specialist}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">AI Medical Voice Agent</p>
                    
                    <div className="flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs text-cyan-300">Powered by GPT-4</span>
                    </div>
                  </div>

                  {/* Voice Wave Visualization */}
                  <div className="mt-6 -mx-2">
                    <VoiceWaveVisualizer isActive={callStarted} role={currentRole} />
                  </div>

                  {/* Call Controls */}
                  <div className="mt-6">
                    {!callStarted ? (
                      <Button
                        onClick={startCall}
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 will-change-transform"
                      >
                        <PhoneCall className="w-5 h-5" />
                        <span>Start Session</span>
                        {!loading ? (
                          <ArrowRight className="w-4 h-4" />
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={endCall}
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 will-change-transform"
                      >
                        <PhoneOff className="w-5 h-5" />
                        <span>End Session</span>
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      </Button>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center">
                      <p className="text-lg font-bold text-cyan-400">{finalMessages.length}</p>
                      <p className="text-xs text-gray-500">Exchanges</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center">
                      <p className="text-lg font-bold text-violet-400">
                        {currentRole === "assistant" ? "AI" : currentRole === "user" ? "You" : "—"}
                      </p>
                      <p className="text-xs text-gray-500">Speaking</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Note */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  <strong className="text-amber-300">Emergency?</strong> If you are experiencing a medical emergency, please call your local emergency number immediately. This AI assistant is not a substitute for professional medical care.
                </p>
              </div>
            </div>

            {/* Right Panel - Conversation */}
            <div className="lg:col-span-2">
              <div className="relative h-[calc(100vh-12rem)] lg:h-[calc(100vh-10rem)]">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700/20 to-gray-700/20 rounded-3xl blur opacity-50" />
                <div className="relative h-full bg-[#111118]/90 border border-gray-800 rounded-3xl backdrop-blur-xl flex flex-col overflow-hidden">
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Conversation</h4>
                        <p className="text-xs text-gray-500">
                          {callStarted ? "Live transcription" : callended ? "Session complete" : "Waiting to start"}
                        </p>
                      </div>
                    </div>
                    {callStarted && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400">Live</span>
                      </div>
                    )}
                  </div>

                  {/* Messages Area */}
                  <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                  >
                    {finalMessages.length === 0 && !liveTranscipt && (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 flex items-center justify-center">
                          <Mic className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-gray-300 font-medium">Start a conversation</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Click "Start Session" to begin speaking with your AI medical assistant
                          </p>
                        </div>
                      </div>
                    )}

                    {finalMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          message.role === "user"
                            ? "bg-gray-700"
                            : "bg-gradient-to-br from-cyan-400 to-blue-500"
                        }`}>
                          {message.role === "user" ? (
                            <User className="w-4 h-4 text-gray-300" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 rounded-tr-sm"
                            : "bg-gray-800/50 rounded-tl-sm"
                        }`}>
                          <p className={`text-sm leading-relaxed ${
                            message.role === "user" ? "text-cyan-100" : "text-gray-300"
                          }`}>
                            {message.text}
                          </p>
                        </div>
                      </div>
                    ))}

                    {liveTranscipt && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
                          <Volume2 className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-800/50 border border-cyan-500/20">
                          <p className="text-sm text-gray-300">{liveTranscipt}</p>
                          <div className="flex gap-1 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area (Visual Only) */}
                  <div className="px-6 py-4 border-t border-gray-800/50">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-900/50 border border-gray-800">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        callStarted 
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20" 
                          : "bg-gray-800"
                      }`}>
                        <Mic className={`w-5 h-5 ${callStarted ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <span className="text-sm text-gray-500 flex-1">
                        {callStarted 
                          ? currentRole === "assistant" ? "AI is speaking..." : "Listening..."
                          : "Tap start to begin conversation"
                        }
                      </span>
                      {callStarted && (
                        <div className="flex gap-0.5">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 rounded-full bg-cyan-400 animate-pulse"
                              style={{ 
                                height: "12px", 
                                animationDelay: `${i * 0.15}s`,
                                animationDuration: "0.6s"
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MedicalAgentSessionPage;