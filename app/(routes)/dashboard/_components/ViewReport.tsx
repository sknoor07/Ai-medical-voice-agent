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
import moment from "moment";
import { useUser } from "@clerk/nextjs";

type Props = {
  entryhistory: sessionDetail;
};
function ViewReport({ entryhistory }: Props) {
  const { user } = useUser();
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"link"} className="cursor-pointer" size={"sm"}>
            View Report
          </Button>
        </DialogTrigger>
        <DialogContent className="h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle asChild>
              <h2 className="text-center text-4xl font-extrabold">
                Medical AI Voice Agent Report
              </h2>
            </DialogTitle>
            <DialogDescription asChild>
              <div className=" mt-10 ">
                <h2 className="font-bold text-blue-500 text-xl">
                  Seesion Info
                </h2>
                <hr className="border-t-2 border-blue-500 mb-4" />
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-y-2">
                  <div>
                    <p className="pb-2">
                      <span className="font-bold">Doctor:</span>{" "}
                      {entryhistory.selectedDoctor.specialist}
                    </p>
                    <p>
                      <span className="font-bold">Consulted On:</span> June 18th
                      2025, 10:27 am
                    </p>
                  </div>
                  <div>
                    <p className="pb-2">
                      <span className="font-bold">User:</span> {user?.username}
                    </p>
                    <p>
                      <span className="font-bold">Agent:</span> General
                      Physician AI
                    </p>
                  </div>
                </div>
                <div className="mt-10">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Chief Complaint
                  </h2>
                  <hr className="border-t-2 border-blue-500 mb-4" />
                  <p>{entryhistory.notes}</p>
                </div>
                <div className="mt-10">
                  <h2 className="font-bold text-blue-500 text-lg">Summary</h2>
                  <hr className="border-t-2 border-blue-500 mb-4" />
                  <p>{entryhistory.report?.summary}</p>
                </div>
                <div className="mt-10">
                  <h2 className="font-bold text-blue-500 text-lg">Symptoms</h2>
                  <hr className="border-t-2 border-blue-500 mb-4" />
                  <ul className="list-disc list-inside space-y-1">
                    {entryhistory?.report?.symptoms?.map((sym, index) => (
                      <li key={index}>{sym}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Duration & Severity
                  </h2>
                  <hr className="border-t-2 border-blue-500 mb-4" />
                  <div className=" grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <div>
                      <p className="pb-2">
                        <span className="font-bold">Duration:</span>{" "}
                        {entryhistory?.report?.duration}
                      </p>
                    </div>
                    <div>
                      <p className="pb-2">
                        <span className="font-bold">Severity:</span>{" "}
                        {entryhistory?.report?.severity}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Medications Mentioned
                  </h2>
                  <hr className="border-t-2 border-blue-500 mb-4" />
                  <ul className="list-disc list-inside space-y-1">
                    {entryhistory?.report?.medicationsMentioned?.length ? (
                      entryhistory.report.medicationsMentioned.map(
                        (sym, index) => <li key={index}>{sym}</li>
                      )
                    ) : (
                      <li className="list-none text-gray-500">Not Mentioned</li>
                    )}
                  </ul>
                </div>
                <div className="mt-10">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Recommendations
                  </h2>
                  <hr className="border-t-2 border-blue-500 mb-4" />
                  <ul className="list-disc list-inside space-y-1">
                    {entryhistory?.report?.recommendations?.map(
                      (sym, index) => (
                        <li key={index}>{sym}</li>
                      )
                    )}
                  </ul>
                </div>
                <h2 className="text-center text-sm font-serif  mt-10">
                  {" "}
                  <span className="font-extralight">
                    This Report is Generated on the Basis of AI Inspection. In
                    case of Serious problem we Recommend to take a in person
                    Appoinment with a doctor.
                  </span>
                </h2>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewReport;
