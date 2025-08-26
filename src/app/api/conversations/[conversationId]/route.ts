import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // adjust path if needed

// GET single conversation
export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const { conversationId } = params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (err) {
    console.error("GET conversation error:", err);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

// PUT → mark as read
export async function PUT(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const { conversationId } = params;
  const body = await req.json();
  const { role } = body as { role: "BOOKER" | "MUSICIAN" };

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  try {
    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: role === "MUSICIAN" ? { readByA: true } : { readByB: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT conversation error:", err);
    return NextResponse.json(
      { error: "Failed to update conversation" },
      { status: 500 }
    );
  }
}
