import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newRole } = await req.json();

    // Validate role
    if (!["MUSICIAN", "BOOKER"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user actually has this role in roles[]
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      include: { musician: true, booker: true },
    });

    if (!dbUser || !dbUser.roles.includes(newRole)) {
      return NextResponse.json(
        { error: "Role not assigned to user" },
        { status: 400 }
      );
    }

    // If switching to musician, check profile exists
    if (newRole === "MUSICIAN" && !dbUser.musician) {
      return NextResponse.json(
        { redirect: "/musician/setup" },
        { status: 200 }
      );
    }

    // If switching to booker, check profile exists
    if (newRole === "BOOKER" && !dbUser.booker) {
      return NextResponse.json({ redirect: "/booker/setup" }, { status: 200 });
    }

    // Update activeRole
    await prisma.user.update({
      where: { clerkUserId: user.id },
      data: { activeRole: newRole },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
