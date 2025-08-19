import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Send a message
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, userId, desc } = body;

    if (!conversationId || !userId || !desc) {
      return NextResponse.json(
        { error: "conversationId, userId, and desc are required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        userId,
        desc,
      },
    });

    // Update conversation with last message
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: desc,
        updatedAt: new Date(),
        // reset read flags depending on sender
        readByMusician: false,
        readByBooker: false,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// Fetch all messages for a conversation
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
