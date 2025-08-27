// /app/api/musician/edit/route.ts

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET: Fetch current musician profile
export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      musician: {
        include: {
          bookings: true,
          reviews: {
            include: {
              user: true, // Reviewer info
            },
          },
        },
      },
    },
  });

  if (!dbUser || !dbUser.roles.includes("MUSICIAN") || !dbUser.musician) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const musician = dbUser.musician;

  const reviews = musician.reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    booker: {
      name: review.user.name || "Anonymous",
      imageUrl: review.user.imageUrl || "",
    },
  }));

  return NextResponse.json({
    ...musician,
    user: {
      email: dbUser.email,
      createdAt: dbUser.createdAt,
    },
    imageUrl: dbUser.imageUrl,
    reviews,
  });
}

// PUT: Update musician profile
export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser || !dbUser.roles.includes("MUSICIAN")) {
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

  // ✅ Update user image
  await prisma.user.update({
    where: { id: dbUser.id },
    data: { imageUrl },
  });

  const updated = await prisma.musician.update({
    where: { userId: dbUser.id },
    data: {
      name,
      genres,
      instruments,
      services,
      location,
      bio,
      coverImage,
      mediaUrls,
    },
  });

  return NextResponse.json(updated);
}
