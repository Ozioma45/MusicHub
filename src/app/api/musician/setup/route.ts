// /app/api/musician/setup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { clerkUserId, name, genre, location, bio, mediaUrls } = body;

  try {
    // Find the user in the DB
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.musician.create({
      data: {
        name,
        genre,
        location,
        bio,
        mediaUrls,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting up musician:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
