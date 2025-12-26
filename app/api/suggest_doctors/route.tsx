import { openai } from "@/config/openAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content:
            "User Notes/ Symptoms:" +
            notes +
            "Depends on user notes and symptoms. please suggest list of doctors from the provided list, Return the response as Array of Objects in JSON format only  ",
        },
      ],
    });
    const rawResponse = completion?.choices[0]?.message?.content;
    console.log("Raw Response:", rawResponse);
    // const res =
    //   rawResponse &&
    //   rawResponse.trim().replace("```json", "").replace("```", "");
    // const JSONRes = JSON.parse(res || "{}");
    // return NextResponse.json(JSONRes);
    if (!rawResponse) {
      return NextResponse.json({ doctors: [] });
    }
    const parsed = JSON.parse(rawResponse.replace(/```json|```/g, "").trim());
    console.log("Parsed Response:", parsed);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error creating chat completion:", error);
    return NextResponse.json(error);
  }
}
