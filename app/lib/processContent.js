import { PrismaClient } from "@prisma/client";
import { createRequire } from "module";

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
        }

        if (content.type === "YOUTUBE") {
            extractedText = "YouTube transcript logic coming soon...";
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