"use server";

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
      include: { musician: true, booker: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find target user in DB
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { musician: true, booker: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    let bookerId: string;
    let musicianId: string;

    // Case 1: current user is musician, target is booker
    if (dbUser.musician && targetUser.booker) {
      musicianId = dbUser.musician.id;
      bookerId = targetUser.booker.id;
    }
    // Case 2: current user is booker, target is musician
    else if (dbUser.booker && targetUser.musician) {
      bookerId = dbUser.booker.id;
      musicianId = targetUser.musician.id;
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid conversation pair. Must be between a MUSICIAN and a BOOKER.",
        },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: { bookerId, musicianId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { bookerId, musicianId },
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
