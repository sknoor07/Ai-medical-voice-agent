"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight, Loader2, Plus, Sparkles } from "lucide-react";
import axios from "axios";
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { sessionDetail } from "../medical-agent/[sessionId]/page";

function AddNewSessionDialog() {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggesteddoctors, setSuggestedDoctors] = useState<doctorAgent[] | undefined>(undefined);
  const [SelectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const router = useRouter();
  const { has } = useAuth();
  const paidUser = has?.({ plan: "pro_user" });
  const [historyList, setHistoryList] = useState<sessionDetail[]>([]);

  const getHistoryList = async () => {
    const result = await axios.get("/api/session_chat", {
      params: { sessionId: "all" },
    });
    console.log("history: ", result.data);
    setHistoryList(result.data);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void getHistoryList();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function onClickNext() {
    setLoading(true);
    const result = await axios.post("/api/suggest_doctors", { notes: note });
    console.log(result.data);
    setSuggestedDoctors(result.data);
    setLoading(false);
  }

  async function startConsultation() {
    if (!SelectedDoctor) {
      alert("Please select a doctor to start the consultation.");
      return;
    }
    setLoading(true);
    const res = await axios.post("/api/session_chat", {
      notes: note,
      selectedDoctor: SelectedDoctor,
    });
    router.push("/dashboard/medical-agent/" + res.data[0].sessionId);
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:scale-105 flex items-center gap-2 will-change-transform"
          disabled={!paidUser && historyList?.length >= 1}
        >
          <Plus className="w-4 h-4" />
          Start Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto bg-[#111118] border-gray-800 text-white">
        <DialogHeader>
          {!suggesteddoctors ? (
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Describe Your Symptoms
            </DialogTitle>
          ) : (
            <DialogTitle className="text-xl font-bold">
              Recommended Specialists
            </DialogTitle>
          )}
          <DialogDescription asChild className="text-gray-400">
            {!suggesteddoctors ? (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-3">
                  Tell us about your symptoms or health concerns. Our AI will match you with the best specialist.
                </p>
                <Textarea
                  placeholder="e.g., I've been experiencing headaches and dizziness for the past 3 days..."
                  className="h-[160px] w-full bg-[#0a0a0f] border-gray-700 text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl resize-none"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div className="max-w-5xl mx-auto mt-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {suggesteddoctors.map((doctor, index) => (
                    <DoctorAgentCard
                      key={index}
                      doctorAgent={doctor}
                      onSelect={(d) => setSelectedDoctor(d)}
                      selectdoctor={SelectedDoctor}
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => setSuggestedDoctors(undefined)}
              className="border-gray-700 text-gray-100 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
          </DialogClose>
          {!suggesteddoctors ? (
            <Button
              type="submit"
              disabled={note.length === 0 || loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
              onClick={async () => await onClickNext()}
            >
              Next
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={loading || !SelectedDoctor}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
              onClick={() => startConsultation()}
            >
              Start Consultation
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;