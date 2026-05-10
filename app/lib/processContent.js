import { PrismaClient, Prisma } from "@prisma/client";
import { createRequire } from "module";
import { chunkText } from "./chunk";
import { YoutubeTranscript } from "youtube-transcript";
import { generateEmbedding } from "./embeding";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
console.log("type:", typeof pdfParse);

const prisma = new PrismaClient();

export async function processContent(contentId, buffer) {
    try {
        const content = await prisma.content.findUnique({
            where: { id: contentId },
        });

        if (!content) return;

        let extractedText = "";

        if (content.type === "PDF" && buffer) {
            const data = await pdfParse(buffer);
            extractedText = data.text;
            const chunks = chunkText(extractedText)
            console.log("chunks:", chunks.length);

            for (const chunk of chunks) {
                const vector = await generateEmbedding(chunk);

                console.log("vector length:", vector.length);
                console.log("vector sample:", vector.slice(0, 3));

                const vectorString = `[${vector.join(",")}]`;

                await prisma.$executeRaw`
                INSERT INTO "Embedding" (id, content, vector, "projectId", "contentId")
                VALUES (
                ${crypto.randomUUID()},
                ${chunk},
                ${Prisma.raw(`'${vectorString}'::vector`)},
                ${content.projectId},
                ${content.id}
                )
                `;

            }
        }

        if (content.type === "YOUTUBE" && content.youtubeUrl) {
            const transcriptItems = await YoutubeTranscript.fetchTranscript(content.youtubeUrl);
            extractedText = transcriptItems.map((item) => item.text).join(" ");

            const chunks = chunkText(extractedText);
            console.log("chunks:", chunks.length);

            for (const chunk of chunks) {
                const vector = await generateEmbedding(chunk);
                const vectorString = `[${vector.join(",")}]`;

                await prisma.$executeRaw`
            INSERT INTO "Embedding" (id, content, vector, "projectId", "contentId")
            VALUES (
            ${crypto.randomUUID()},
            ${chunk},
            ${Prisma.raw(`'${vectorString}'::vector`)},
            ${content.projectId},
            ${content.id}
            )
        `;
            }
        }

        await prisma.content.update({
            where: { id: contentId },
            data: {
                transcript: extractedText,
                status: "ready",
            },
        });
    } catch (err) {
        console.error("Processing failed:", err);

        await prisma.content.update({
            where: { id: contentId },
            data: { status: "failed" },
        });
    }
}