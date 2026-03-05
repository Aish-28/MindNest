import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const { name, email, password,  } = await request.json();

  if (!name || !email || !password) {
    return new Response("Missing fields", { status: 400 });
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return new Response("User already exists", { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
     
    },
  });

  return Response.json({
    id: user.id,
    email: user.email,
   
  });
}