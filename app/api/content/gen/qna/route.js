import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {searchSimilarChunks } from '../../../../lib/search';
import {askGemini } from '../../../../lib/geminiConfig'
const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { question, projectId } = await request.json();

        if (!question || !projectId) {
            return NextResponse.json({ error: "Missing question or projectId in the request body." }, { status: 400 });
        }

        const chunks = await searchSimilarChunks(question, projectId, 5);

        if (chunks.length === 0) {
            return NextResponse.json({ error: "No relevant content found for the question." }, { status: 404 });
        }

        const prompt = `You are a helpful study assistant.
        Answer ONLY based on the context provided below.
        If the answer is not in the context, say "This information is not available in the uploaded material."
        Do not use any outside knowledge.
        CONTEXT:
        ${chunks.join("\n\n---\n\n")}
        QUESTION:${question} Give a clear, concise answer.`
        const answer = askGemini(prompt);
        return NextResponse.json({answer});
    }
    catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "An error occurred while processing the request." }, { status: 500 });
    }
}