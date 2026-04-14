import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { processContent } from "../../../lib/processContent"



export async function POST(request) {

    try {
        const formData = await request.formData();
        const projectId = formData.get("projectId");
        const type = formData.get("type");
        const title = formData.get("title");

        let fileUrl = null;
        let youtubeUrl = null;
        let transcript = null;

        if (type === "PDF") {
            const file = formData.get("file");

            if (!file) {
                return NextResponse.json({ error: "File is required for PDF type" }, { status: 400 });
            }
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            fileUrl = "C:/Users/User/Downloads/4.pdf";
            const content = await prisma.content.create({
                data: {
                    title,
                    type: "PDF",
                    fileUrl,
                    projectId,
                    status: "processing",
                },
            });

            // async processing
            processContent(content.id, buffer);

            return NextResponse.json({ success: true, content });
        }

    }
    catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
        
    }
}