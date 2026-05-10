import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../../lib/auth-middleware"

const prisma = new PrismaClient();

export async function GET(request, {params}) {
    const resolvedParams = await params;
    const { user, error } = requireAuth(request);

    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const project = await prisma.project.findFirst({
            where: {
                id: resolvedParams.id,
                userId: user.id, 
            },
            include: {
                contents: true,
                questionBanks: true,
                notes: true,
                topicAnalysis: true,
                projectContents: true,
                embeddings: true,
            },
            
        });

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Project fetched successfully",
                project,
            },
            { status: 200 }
        );
    } catch (err) {
        console.log("Error fetching project:", err);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}