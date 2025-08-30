// /app/api/musician/setup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    location,
    bio,
    coverImage,
    imageUrl,
    genres: rawGenres,
    instruments: rawInstruments,
    services: rawServices,
    mediaUrls: rawMediaUrls,
  } = body;

  const genres = Array.isArray(rawGenres)
    ? rawGenres
    : rawGenres
    ? [rawGenres]
    : [];
  const instruments = Array.isArray(rawInstruments)
    ? rawInstruments
    : rawInstruments
    ? [rawInstruments]
    : [];
  const services = Array.isArray(rawServices)
    ? rawServices
    : rawServices
    ? [rawServices]
    : [];
  const mediaUrls = Array.isArray(rawMediaUrls) ? rawMediaUrls : [];

  try {
    // ✅ Update user image
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { imageUrl },
    });

    const created = await prisma.musician.create({
      data: {
        name,
        genres,
        instruments,
        services,
        location,
        bio,
        coverImage,
        mediaUrls,
        user: {
          connect: { id: dbUser.id }, // 👈 connect musician to logged-in user
        },
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("Error setting up musician:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create musician" },
      { status: 500 }
    );
  }
}
