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
  let {
    name,
    genres,
    instruments,
    services,
    location,
    bio,
    coverImage,
    mediaUrls,
  } = body;

  // Ensure arrays for multi-input fields
  genres = Array.isArray(genres) ? genres : genres ? [genres] : [];
  instruments = Array.isArray(instruments)
    ? instruments
    : instruments
    ? [instruments]
    : [];
  services = Array.isArray(services) ? services : services ? [services] : [];
  mediaUrls = Array.isArray(mediaUrls) ? mediaUrls : [];

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
