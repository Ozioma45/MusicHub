// /app/api/musician/profile/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET current profile
export async function GET() {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: { musician: true },
  });

  if (!dbUser || dbUser.role !== "MUSICIAN" || !dbUser.musician) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json(dbUser.musician);
}

// PUT update profile
export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser || dbUser.role !== "MUSICIAN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const body = await req.json();
  const { name, genre, location, bio, coverImage, mediaUrls } = body;

  const updated = await prisma.musician.update({
    where: { userId: dbUser.id },
    data: {
      name,
      genre,
      location,
      bio,
      coverImage,
      mediaUrls,
    },
  });

  return NextResponse.json(updated);
}
