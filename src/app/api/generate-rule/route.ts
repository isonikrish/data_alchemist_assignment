import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const systemPrompt = `
You are an AI that converts rule descriptions into structured JSON.

Return only one JSON object and nothing else.

Supported types: "coRun", "slotRestriction", "loadLimit".

Examples:
Input: "Run tasks T1 and T2 together"
Output:
{
  "type": "coRun",
  "tasks": ["T1", "T2"]
}

Input: "Limit Backend group to 3 tasks per phase"
Output:
{
  "type": "loadLimit",
  "group": "Backend",
  "maxSlotsPerPhase": 3
}

Input: "Sales group needs at least 2 common slots"
Output:
{
  "type": "slotRestriction",
  "group": "Sales",
  "minCommonSlots": 2
}

Now respond with the JSON for:
"${prompt}"
`;

  try {
    const result = await model.generateContent(systemPrompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const rule = JSON.parse(cleaned);
    return NextResponse.json({ rule });
  } catch {
    return NextResponse.json({ error: "AI failed to parse rule." }, { status: 500 });
  }
}
