import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { bookerId: string } }
) {
  try {
    const { bookerId } = params;

    const booker: any = await prisma.user.findUnique({
      where: { id: bookerId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        role: true,
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

    if (!booker || booker.role !== "BOOKER") {
      return NextResponse.json({ error: "Booker not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...booker,
      bookings: booker.bookings.map((b: any) => ({
        ...b,
        musician: {
          ...b.musician,
          imageUrl: b.musician.user.imageUrl,
        },
      })),
      reviews: booker.reviews.map((r: any) => ({
        ...r,
        musician: {
          ...r.musician,
          imageUrl: r.musician.user.imageUrl,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching booker profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
