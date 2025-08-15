import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookerId: string }> }
) {
  const { bookerId } = await params;

  const booker = await prisma.user.findUnique({
    where: { id: bookerId },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      activeRole: true,
      bookings: {
        orderBy: { date: "desc" },
        select: {
          id: true,
          eventType: true,
          date: true,
          location: true,
          musician: {
            select: {
              id: true,
              name: true,
              user: { select: { imageUrl: true } },
            },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          musician: {
            select: {
              id: true,
              name: true,
              user: { select: { imageUrl: true } },
            },
          },
        },
      },
    },
  });

  if (!booker || booker.activeRole !== "BOOKER") {
    return NextResponse.json({ error: "Booker not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...booker,
    bookings: booker.bookings.map((b) => ({
      ...b,
      musician: {
        ...b.musician,
        imageUrl: b.musician.user.imageUrl,
      },
    })),
    reviews: booker.reviews.map((r) => ({
      ...r,
      musician: {
        ...r.musician,
        imageUrl: r.musician.user.imageUrl,
      },
    })),
  });
}
