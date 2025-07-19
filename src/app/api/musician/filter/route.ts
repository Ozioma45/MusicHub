// /app/api/musicians/route.ts (or wherever you organize API routes)
import { prisma } from "@/lib/db"; // adjust path to your db config
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre");
  const location = searchParams.get("location");
  const name = searchParams.get("name");

  const musicians = await prisma.musician.findMany({
    where: {
      genre: genre || undefined,
      location: location || undefined,
      name: name
        ? {
            contains: name,
            mode: "insensitive",
          }
        : undefined,
    },
    include: {
      reviews: true,
      user: true,
    },
  });

  return NextResponse.json(musicians);
}
