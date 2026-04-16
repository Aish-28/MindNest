import { NextResponse } from "next/server";
import { searchSimilarChunks } from "../../../../lib/search";
import { askGemini } from "../../../../lib/geminiConfig";

export async function POST(request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    // broader seed queries to pull diverse content for notes
    const seedQueries = [
      "key concepts and definitions",
      "important theories and principles",
      "processes and methods",
      "examples and applications",
      "summaries and conclusions",
    ];

    const chunkSets = await Promise.all(
      seedQueries.map(q => searchSimilarChunks(q, projectId, 5))
    );

    // flatten and deduplicate
    const allChunks = [...new Set(chunkSets.flat())];

    if (allChunks.length === 0) {
      return NextResponse.json({ error: "No content found for this project" }, { status: 404 });
    }

    const prompt = `
You are a study assistant that creates concise, well-structured study notes.
Based ONLY on the context provided below, generate structured study notes.
Do not use any outside knowledge. Only include what is explicitly present in the context.

CONTEXT:
${allChunks.join("\n\n---\n\n")}

Generate study notes in the following JSON format ONLY, no markdown, no explanation:
{
  "title": "Notes title based on the content",
  "sections": [
    {
      "heading": "Section heading",
      "points": [
        "concise note point 1",
        "concise note point 2"
      ]
    }
  ],
  "summary": "A 2-3 sentence overall summary of the material"
}
    `;

    const raw = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const notes = JSON.parse(clean);

    return NextResponse.json({ notes, totalChunks: allChunks.length });

  } catch (err) {
    console.error("Notes generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}