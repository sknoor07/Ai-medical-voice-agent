import { db } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { sessionChatTable } from "@/config/schema";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { notes, selectedDoctor } = await request.json();
  try {
    const uuid = uuidv4();
    const user = await currentUser();
    const result = await db
      .insert(sessionChatTable)
      .values({
        sessionId: uuid,
        notes: notes,
        selectedDoctor: selectedDoctor,
        conversation: {},
        report: {},
        createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
        createdOn: new Date().toString(),
      })
      .returning();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in session chat API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
