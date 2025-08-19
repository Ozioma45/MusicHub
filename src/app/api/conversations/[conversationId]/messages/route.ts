import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type Params = { params: { conversationId: string } };

// Send message in a conversation
export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    const { desc } = await req.json();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!desc) {
      return NextResponse.json(
        { error: "Message content required" },
        { status: 400 }
      );
    }

    // 🔎 Step 1: Find the internal User.id from Clerk's userId
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 📝 Step 2: Create the message with internal User.id
    const message = await prisma.message.create({
      data: {
        conversationId: await params.conversationId,
        userId: dbUser.id, // internal UUID
        desc,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Get all messages in a conversation
export async function GET(req: Request, { params }: Params) {
  try {
    const { conversationId } = await params;

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
