import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  try {
    const users = await db
      .select()
      .from(usersTable)
      //@ts-expect-ignore
      .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

    if (users?.length === 0) {
      const newUser = await db
        .insert(usersTable)
        .values({
          name: user?.fullName || "No Name",
          email: user?.primaryEmailAddress?.emailAddress || "",
          credits: 10,
        })
        .returning();
      return NextResponse.json(newUser);
    }
    return NextResponse.json(users[0]);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
