"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import { useUser } from "@clerk/nextjs";
import { FileText, Stethoscope, User, Calendar, AlertTriangle } from "lucide-react";

type Props = {
  entryhistory: sessionDetail;
};

function ViewReport({ entryhistory }: Props) {
  const { user } = useUser();

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            size="sm"
          >
            <FileText className="w-4 h-4 mr-1" />
            View Report
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle asChild>
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Medical Report
                </h2>
                <p className="text-sm text-gray-500 mt-1">AI-Generated Consultation Summary</p>
              </div>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-6">
                {/* Session Info */}
                <div className="p-4 rounded-2xl bg-[#111118] border border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-semibold text-cyan-300">Session Info</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Doctor</p>
                      <p className="text-white font-medium">{entryhistory.selectedDoctor.specialist}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">User</p>
                      <p className="text-white font-medium">{user?.username}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="text-white font-medium">June 18th 2025, 10:27 am</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Agent</p>
                      <p className="text-white font-medium">General Physician AI</p>
                    </div>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div className="p-4 rounded-2xl bg-[#111118] border border-gray-800">
                  <h3 className="font-semibold text-cyan-300 mb-2">Chief Complaint</h3>
                  <p className="text-gray-300 text-sm">{entryhistory.report?.chiefComplaint}</p>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-2xl bg-[#111118] border border-gray-800">
                  <h3 className="font-semibold text-cyan-300 mb-2">Summary</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{entryhistory.report?.summary}</p>
                </div>

                {/* Symptoms */}
                <div className="p-4 rounded-2xl bg-[#111118] border border-gray-800">
                  <h3 className="font-semibold text-cyan-300 mb-2">Symptoms</h3>
                  <ul className="space-y-1">
                    {entryhistory?.report?.symptoms?.map((sym, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        {sym}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Duration & Severity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#111118] border border-gray-800">
                    <h3 className="font-semibold text-cyan-300 mb-1 text-sm">Duration</h3>
                    <p className="text-gray-300 text-sm">{entryhistory?.report?.duration}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#111118] border border-gray-800">
                    <h3 className="font-semibold text-cyan-300 mb-1 text-sm">Severity</h3>
                    <p className="text-gray-300 text-sm">{entryhistory?.report?.severity}</p>
                  </div>
                </div>

                {/* Medications */}
                <div className="p-4 rounded-2xl bg-[#111118] border border-gray-800">
                  <h3 className="font-semibold text-cyan-300 mb-2">Medications Mentioned</h3>
                  {entryhistory?.report?.medicationsMentioned?.length ? (
                    <ul className="space-y-1">
                      {entryhistory.report.medicationsMentioned.map((med, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-violet-400" />
                          {med}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Not Mentioned</p>
                  )}
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-2xl bg-[#111118] border border-gray-800">
                  <h3 className="font-semibold text-cyan-300 mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {entryhistory?.report?.recommendations?.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300/80 leading-relaxed">
                    This report is generated based on AI inspection. In case of serious problems, we recommend taking an in-person appointment with a doctor.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewReport;  