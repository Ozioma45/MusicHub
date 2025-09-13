// /app/api/musician/filter/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre") || "";
  const location = searchParams.get("location") || "";
  const name = searchParams.get("name") || "";

  const musicians = await prisma.musician.findMany({
    where: {
      // ✅ Match genre only if provided
      genres: genre !== "" ? { has: genre } : undefined,

      // ✅ Partial + case-insensitive search for location
      location:
        location !== ""
          ? { contains: location, mode: "insensitive" }
          : undefined,

      // ✅ Partial + case-insensitive search for name
      name: name !== "" ? { contains: name, mode: "insensitive" } : undefined,
    },
    include: {
      reviews: true,
      user: true,
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: {
      bookings: {
        _count: "desc", // 👈 order by most bookings
      },
    },
  });

  return NextResponse.json(musicians);
}
