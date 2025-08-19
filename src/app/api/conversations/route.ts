import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Create conversation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { musicianId, bookerId } = body;

    if (!musicianId || !bookerId) {
      return NextResponse.json(
        { error: "musicianId and bookerId are required" },
        { status: 400 }
      );
    }

    let conversation = await prisma.conversation.findFirst({
      where: { musicianId, bookerId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          musicianId,
          bookerId,
          readByMusician: true,
          readByBooker: false,
        },
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

// Get all conversations for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role"); // "MUSICIAN" | "BOOKER"

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where:
        role === "MUSICIAN" ? { musicianId: userId } : { bookerId: userId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
