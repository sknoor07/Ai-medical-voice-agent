import { db } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { sessionChatTable } from "@/config/schema";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { json } from "drizzle-orm/pg-core";
import { useUser } from "@clerk/nextjs";

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();
    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }
    if (sessionId == "all") {
      const sessions = await db
        .select()
        .from(sessionChatTable)
        .where(
          //@ts-ignore
          eq(
            sessionChatTable.createdBy,
            user?.primaryEmailAddress?.emailAddress
          )
        )
        .orderBy(desc(sessionChatTable.id));
      return NextResponse.json(sessions);
    } else {
      const sessions = await db
        .select()
        .from(sessionChatTable)
        .where(eq(sessionChatTable.sessionId, sessionId));
      return NextResponse.json(sessions[0]);
    }
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
