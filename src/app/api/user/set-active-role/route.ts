// app/api/user/set-active-role/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { newRole } = body as { newRole: "MUSICIAN" | "BOOKER" };

    if (!newRole) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Lookup Clerk user → DB user
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!dbUser.roles.includes(newRole)) {
      return NextResponse.json(
        { error: `You do not have the ${newRole} role assigned` },
        { status: 403 }
      );
    }

    // Update active role
    const updated = await prisma.user.update({
      where: { id: dbUser.id },
      data: { activeRole: newRole },
    });

    return NextResponse.json({
      success: true,
      activeRole: updated.activeRole,
      redirect: `/dashboard/${newRole.toLowerCase()}`,
    });
  } catch (err) {
    console.error("Role switch error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
