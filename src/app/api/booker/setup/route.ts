// /app/api/booker/setup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { clerkUserId, name, location, bio, imageUrl } = body;

  try {
    // Find the user in the DB
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.booker.create({
      data: {
        name,
        location,
        bio,
        imageUrl,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting up booker:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booker" },
      { status: 500 }
    );
  }
}
