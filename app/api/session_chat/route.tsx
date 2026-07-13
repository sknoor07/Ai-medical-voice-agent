import { db } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { sessionChatTable, usersTable } from "@/config/schema";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const { notes, selectedDoctor } = await request.json();
  try {
    const uuid = uuidv4();
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress || "unknown";

    const existingUser = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!existingUser.length) {
      await db.insert(usersTable).values({
        name: user?.fullName || "No Name",
        email,
        credits: 10,
      });
    }

    const result = await db
      .insert(sessionChatTable)
      .values({
        sessionId: uuid,
        notes: notes,
        selectedDoctor: selectedDoctor,
        conversation: {},
        report: {},
        createdBy: email,
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
    const user = await currentUser().catch(() => null);
    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }
    const email = user?.primaryEmailAddress?.emailAddress;
    if (sessionId == "all") {
      const sessions = await db
        .select()
        .from(sessionChatTable)
        .where(
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

export async function DELETE(request: NextRequest) {
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
    
    // Safety check: ensure only the creator can delete their session
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .delete(sessionChatTable)
      .where(
        eq(sessionChatTable.sessionId, sessionId)
      )
      .returning();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
