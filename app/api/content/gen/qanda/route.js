import { NextResponse } from "next/server";
import { searchSimilarChunks } from '../../../../lib/search';
import { askGemini } from "../../../../lib/geminiConfig";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { projectId, count = 5 } = await request.json();
    console.log("Received projectId:", projectId);

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const seedQueries = ["key concepts", "main ideas", "important definitions", "core principles"];
    const chunkSets = await Promise.all(
      seedQueries.map(q => searchSimilarChunks(q, projectId, 4))
    );

    const allChunks = [...new Set(chunkSets.flat())];

    if (allChunks.length === 0) {
      return NextResponse.json({ error: "No content found for this project" }, { status: 404 });
    }

    const prompt = `
You are a study assistant. Based ONLY on the context below, generate exactly ${count} question and answer pairs.
Do not use any outside knowledge. Only generate Q&A from what is explicitly present in the context.

CONTEXT:
${allChunks.join("\n\n---\n\n")}

Respond ONLY with a valid JSON array in this exact format, no markdown, no explanation:
[
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." }
]
    `;

    const raw = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const pairs = JSON.parse(clean);

    // Create QuestionBank with all questions in one transaction
    const questionBank = await prisma.questionBank.create({
      data: {
        title: `Q&A Bank`,
        projectId,
        questions: {
          create: pairs.map(pair => ({
            type: "SHORT",   // adjust to match your QuestionType enum
            text: pair.question,
            answer: pair.answer,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({
      pairs,
      questionBankId: questionBank.id,
      totalChunks: allChunks.length,
    });

  } catch (err) {
    console.error("Q&A generate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}