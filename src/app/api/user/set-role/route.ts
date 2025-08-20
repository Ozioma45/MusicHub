import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, clerkUserId } = body;

    if (!role || !clerkUserId) {
      return NextResponse.json(
        { error: "Missing role or user ID" },
        { status: 400 }
      );
    }

    // ✅ Only update activeRole, not roles[]
    const user = await prisma.user.update({
      where: { clerkUserId },
      data: { activeRole: role },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating active role:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
