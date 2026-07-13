"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import { Button } from "@/components/ui/button";
import moment from "moment";
import ViewReport from "./ViewReport";
import { Stethoscope, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  allHistoryList: sessionDetail[];
};

function HistoryTable({ allHistoryList }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead className="text-cyan-400 font-medium">Specialist</TableHead>
            <TableHead className="text-cyan-400 font-medium">Description</TableHead>
            <TableHead className="text-cyan-400 font-medium">Date</TableHead>
            <TableHead className="text-cyan-400 font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allHistoryList.map((history, index) => (
            <TableRow
              key={index}
              className="border-gray-800/50 hover:bg-gray-800/30 transition-colors group"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="font-medium text-white">
                    {history.selectedDoctor.specialist}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-400 max-w-xs truncate">
                  {history.notes}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {moment(new Date(history.createdOn)).fromNow()}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <ViewReport entryhistory={history} />
                  <Link href={`/dashboard/medical-agent/${history.sessionId}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;