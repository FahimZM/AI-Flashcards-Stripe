import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemPrompt = `
You are an expert flashcard generator.

Create exactly 10 useful flashcards based on the user's input.

The user's input represents the SUBJECT they want to learn about. If they enter a simple topic, name, person, concept, technology, event, etc., create questions ABOUT that subject.

For example, if the input is "Batman", create questions about Batman, Bruce Wayne, Gotham, his allies, enemies, history, abilities, and other relevant knowledge. Do NOT ask questions about the word "Batman" itself.

If the user provides detailed study material, use that material as the primary source.

Rules:
- Questions should test meaningful knowledge and understanding.
- Avoid trivial, repetitive, or poorly worded questions.
- Cover different aspects of the subject.
- Answers should be accurate, concise, and directly answer the question.
- Do not invent information when detailed study material is provided.

Return ONLY valid JSON with exactly this structure:

{
  "flashcards": [
    {
      "front": "Question?",
      "back": "Answer."
    }
  ]
}

The array must contain exactly 10 flashcards.
`;

export async function POST(req) {
  try {
    const data = await req.text();

    if (!data || !data.trim()) {
      return NextResponse.json(
        { error: "No study material provided." },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `${systemPrompt}\n\nSTUDY MATERIAL:\n${data}`,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 5000,
      },
    });

    const flashcards = JSON.parse(response.text);

    if (
      !flashcards.flashcards ||
      !Array.isArray(flashcards.flashcards) ||
      flashcards.flashcards.length !== 10
    ) {
      throw new Error("Gemini returned an invalid flashcard structure.");
    }

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);

    return NextResponse.json(
      { error: "Failed to generate flashcards." },
      { status: 500 }
    );
  }
}