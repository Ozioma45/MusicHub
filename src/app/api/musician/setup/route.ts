// /app/api/musician/setup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    clerkUserId,
    name,
    genres, // array of strings
    instruments, // array of strings
    services, // array of strings
    location,
    bio,
    coverImage,
    mediaUrls = [],
  } = body;

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
        genres, // store array directly
        instruments, // store array directly
        services, // store array directly
        location,
        bio,
        coverImage,
        mediaUrls,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting up musician:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create musician" },
      { status: 500 }
    );
  }
}
