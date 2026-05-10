import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const  resolvedPerams  = await params;

  const content = await prisma.content.findUnique({
    where: { id: resolvedPerams.contentId },
    select: { id: true, status: true, title: true, type: true },
  });

  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(content);
}