"use client";
import { AIDoctorAgents } from "@/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";

function DoctorAgentlist() {
  return (
    <div className=" mt-10">
      <h2 className="font-bold text-xl"> AI Specialist Doctors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 my-5 mt-10">
        {AIDoctorAgents.map((doctors, index) => {
          return (
            <div key={index}>
              <DoctorAgentCard doctorAgent={doctors} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DoctorAgentlist;
