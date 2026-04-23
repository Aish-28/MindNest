import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../../lib/auth-middleware";

const prisma=new PrismaClient();

export async function GET(request) {
    
    const {user, error}=requireAuth(request);

    if (!user){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try{
        const projects=await prisma.project.findMany({
            where:{userId:user.id,},
            orderBy:{createdAt:"desc"},
        });

        return NextResponse.json({
            message:"Projects fetched successfully",
            projects,
        },
        {status:200}
        );
    }
    catch(err){
        console.log("Error in fetching projects ",err);
        return NextResponse.json(
            {message:"Internal server error"},
            {status:500}
        );
    }
}