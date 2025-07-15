import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { role, clerkUserId } = body;

  if (!role || !clerkUserId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { clerkUserId },
    data: { role },
  });

  return NextResponse.json({ success: true, user });
}
