import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  const { name, email, password,  } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({message:"Missing fields"}, { status: 400 });
  }

  const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(email)){
    return NextResponse.json({message:"Invalid email format"},{status: 400});
  }

  const passPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if(!passPattern.test(password)){
      return NextResponse.json({message:"Password must be 8-20 characters and include uppercase, lowercase, number, and special character"},{status:400});
    }

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return NextResponse.json({message:"User already exists"}, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
     
    },
  });

  return NextResponse.json({
    message:"User created",
    id: user.id,
    email: user.email,
   
  });
}