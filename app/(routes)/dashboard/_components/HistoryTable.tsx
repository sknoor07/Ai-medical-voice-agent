import { Ghost } from "lucide-react";
import React, { use, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import { Button } from "@/components/ui/button";
import moment from "moment";

type Props = {
  allHistoryList: sessionDetail[];
};

function HistoryTable({ allHistoryList }: Props) {
  return (
    <div>
      <Table>
        <TableCaption>Pevious Consultations Histroy.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">AI Medical Specialist</TableHead>
            <TableHead className="w-[200px]">Discription</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allHistoryList.map((history, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {history.selectedDoctor.specialist}
              </TableCell>
              <TableCell>{history.notes}</TableCell>
              <TableCell>
                {moment(new Date(history.createdOn)).fromNow()}
              </TableCell>
              <TableCell className="text-right">
                <Button variant={"link"} className="cursor-pointer" size={"sm"}>
                  View Report
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
