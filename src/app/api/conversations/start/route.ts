import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Missing targetUserId" },
        { status: 400 }
      );
    }

    // Find the current user in DB
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sort user IDs so order is always consistent
    const [userAId, userBId] =
      dbUser.id < targetUserId
        ? [dbUser.id, targetUserId]
        : [targetUserId, dbUser.id];

    // Check if conversation already exists
    let conversation = await prisma.conversation.findUnique({
      where: { userAId_userBId: { userAId, userBId } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { userAId, userBId },
      });
    }

    return NextResponse.json({ conversationId: conversation.id });
  } catch (error) {
    console.error("🚨 Error in POST /conversation:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
