"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { use, useEffect } from "react";

function MedicalAgentSessionPage() {
  const { sessionId } = useParams();

  const fetchSessionData = async () => {
    const result = await axios.get("/api/session_chat", {
      params: { sessionId: sessionId },
    });
    console.log("Session Data:", result.data);
  };

  useEffect(() => {
    sessionId && fetchSessionData();
  }, [sessionId]);
  return <div>Medical Agent Session Page {sessionId}</div>;
}
export default MedicalAgentSessionPage;
