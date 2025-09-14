import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!; // put this in .env

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // Create JWT
  const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  (await cookies()).set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600,
  });

  return NextResponse.json({ success: true });
}
