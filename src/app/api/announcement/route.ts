// app/api/announcement/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const announcement = await prisma.announcement.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(announcement || {});
}

// ✅ POST handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, active = true } = body;

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Optionally deactivate all previous announcements
    await prisma.announcement.updateMany({
      where: { active: true },
      data: { active: false },
    });

    // Create a new announcement
    const newAnnouncement = await prisma.announcement.create({
      data: {
        message,
        active,
      },
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
