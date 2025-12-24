"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

function HistoryList() {
  const [historyList, setHistoryList] = React.useState([]);
  return (
    <div>
      {historyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-5 border border-dashed rounded-2xl">
          <Image
            src={"/medical-assistance.png"}
            alt="No History Image"
            width={200}
            height={200}
          />
          <h2 className="font-bold text-xl">No Recent Conversation</h2>
          <p>Your Recent Conversation will apper here.</p>
          <Button className="mt-3 cursor-pointer">
            + Start a Consultation
          </Button>
        </div>
      ) : (
        <div>List</div>
      )}
    </div>
  );
}

export default HistoryList;
