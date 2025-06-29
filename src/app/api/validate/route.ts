import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  const { type, data } = await req.json();

  const prompt = `
  You are an AI validator. Given spreadsheet data of type "${type}", check for:
  - missing required fields
  - empty string values
  - invalid email fields (if applicable)

  Return ONLY valid JSON in this format:
  [
    {
      "rowIndex": 0,
      "field": "email",
      "message": "Missing email"
    }
  ]

  Now validate this data:
  ${JSON.stringify(data, null, 2)}
`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();


    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start === -1 || end === -1) {
      throw new Error("JSON block not found in AI response");
    }

    const jsonText = raw.substring(start, end + 1);

    try {
      const errors = JSON.parse(jsonText);
      return NextResponse.json({ errors });
    } catch {
      throw new Error("Failed to parse extracted JSON");
    }
  } catch {
    return NextResponse.json(
      { errors: [], error: "Validation failed." },
      { status: 500 }
    );
  }
}
