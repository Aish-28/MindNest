import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 1. Fetch all projects for this user
    // 2. Use _count to get the number of related items per project
    const projects = await prisma.project.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            contents: true,      // Counts based on Content table's projectId
            questionBanks: true, // Counts related QuestionBanks
            notes: true          // Counts related Notes
          }
        },
        topicAnalysis: true,     // Included for the Topics column in your table
      }
    });

    // 3. Aggregate totals for the Stats Cards
    const totalStats = projects.reduce((acc, project) => {
      acc.totalFiles += project._count.contents || 0;
      acc.totalQuestions += project._count.questionBanks || 0;
      acc.totalNotes += project._count.notes || 0;
      return acc;
    }, { totalFiles: 0, totalQuestions: 0, totalNotes: 0 });

    return NextResponse.json({
      projects: projects.map(p => ({
        title: p.title,
        topicCount: p.topicAnalysis?.length || 0,
        questionCount: p._count.questionBanks,
        noteCount: p._count.notes
      })),
      stats: {
        totalProjects: projects.length,
        ...totalStats
      }
    });

  } catch (error) {
    console.error("DASHBOARD_ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to load dashboard data", details: error.message }, 
      { status: 500 }
    );
  }
}