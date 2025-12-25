"use client";
import React, { useState } from "react";
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
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard";
import { Loader2 } from "lucide-react";

function AddNewSessionDialog() {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggesteddoctors, setSuggestedDoctors] = useState<
    doctorAgent[] | undefined
  >(undefined);

  const [SelectedDoctor, setSelectedDoctor] = useState<doctorAgent>();

  async function onClickNext() {
    setLoading(true);
    const result = await axios.post("/api/suggest_doctors", { notes: note });
    console.log("Suggested Doctors:", result.data);
    setSuggestedDoctors(result.data);
    setLoading(false);
  }
  function startConsultation() {
    if (!SelectedDoctor) {
      alert("Please select a doctor to start the consultation.");
      return;
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 cursor-pointer">+ Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          {!suggesteddoctors ? (
            <DialogTitle>Add basic Details?</DialogTitle>
          ) : (
            <DialogTitle>Suggested Doctors</DialogTitle>
          )}
          <DialogDescription asChild>
            {!suggesteddoctors ? (
              <div>
                <h2> Add Symptoms or Any Other Details</h2>
                <Textarea
                  placeholder="Type here..."
                  className=" h-[200px] w-full mt-3"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                  {suggesteddoctors.map((doctor, index) => (
                    <DoctorAgentCard
                      key={index}
                      doctorAgent={doctor}
                      onSelect={(d) => setSelectedDoctor(d)}
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                setSuggestedDoctors(undefined);
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          {!suggesteddoctors ? (
            <Button
              type="submit"
              disabled={note.length === 0 || loading}
              className="cursor-pointer"
              onClick={async () => await onClickNext()}
            >
              Next{" "}
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <IconArrowRight />
              )}
            </Button>
          ) : (
            <Button
              type="submit"
              className="cursor-pointer"
              onClick={() => startConsultation()}
            >
              Start Consultation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default AddNewSessionDialog;
