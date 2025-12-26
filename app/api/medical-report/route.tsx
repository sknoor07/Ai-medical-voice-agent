import { db } from "@/config/db";
import { openai } from "@/config/openAiModel";
import { sessionChatTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { messages, sessioninfo, sessionid, username } = await req.json();

  const REPORT_GENERATION_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on Doctor AI agent Info and Conversation between Ai medical agent and user , generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
IMPORTANT:
- Set the "user" field EXACTLY to this value: "${username}"
Return the result in this JSON format:
{
 "sessionId": "string",
 "agent": "string",
 "user": "string",
 "timestamp": "ISO Date string",
 "chiefComplaint": "string",
 "summary": "string",
 "symptoms": ["symptom1", "symptom2"],
 "duration": "string",
 "severity": "string",
 "medicationsMentioned": ["med1", "med2"],
 "recommendations": ["rec1", "rec2"],
}
Only include valid fields. Respond with nothing else.

`;
  try {
    const USER_INPUT =
      "AI DOCTOR AGENT INFO: " +
      JSON.stringify(sessioninfo) +
      ", Converstaion: " +
      JSON.stringify(messages);
    const completion = await openai.chat.completions.create({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [
        { role: "system", content: REPORT_GENERATION_PROMPT },
        {
          role: "user",
          content: USER_INPUT,
        },
      ],
    });
    const rawResponse = completion?.choices[0]?.message?.content;
    console.log("Raw Response:", rawResponse);
    if (!rawResponse) {
      return NextResponse.json({ doctors: [] });
    }
    const parsed = JSON.parse(rawResponse.replace(/```json|```/g, "").trim());
    console.log("Parsed Response:", parsed);

    const result = await db
      .update(sessionChatTable)
      .set({
        report: parsed,
        conversation: messages,
      })
      .where(eq(sessionChatTable.sessionId, sessionid));

    return NextResponse.json(parsed);
  } catch (e) {
    console.log("report Generation error: ", e);
    return NextResponse.json(
      { error: "Report Generation Server Error" },
      { status: 500 }
    );
  }
}
