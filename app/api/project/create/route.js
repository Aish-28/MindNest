import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { requireAuth } from "../../../lib/auth-middleware";

const prisma = new PrismaClient();

export async function POST(request) {
    const { user, error } = requireAuth(request);
    console.log("Authenticated user:", user);
    
    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { title, description } = body;

        if (!title || !description) {
            return NextResponse.json(
                { message: "Title and description are required" },
                { status: 400 }
            );
        }

        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                userId: user.id
            }
        })
        return NextResponse.json({
            message: "Project created successfully",
            newProject,
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}