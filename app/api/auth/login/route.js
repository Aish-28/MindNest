import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signJwt } from '../../../lib/jwt'

const prisma = new PrismaClient();

export async function POST(request) {
    const { email, password, } = await request.json();

    if (!email || !password) {
        return new Response("Missing fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return new Response("User does not exists", { status: 409 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return new Response("Invalid credentials", { status: 401 });
    }

    const token = signJwt({
        id: user.id,
        email: user.email,
        name: user.name,
    });

    return Response.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,

        },
    });
}