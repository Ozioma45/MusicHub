import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roles, clerkUserId } = body;

    if (!roles || !clerkUserId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { clerkUserId },
      data: { roles },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
