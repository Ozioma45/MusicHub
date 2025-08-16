import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ musicianId: string }> }
) {
  const { musicianId } = await context.params;

  try {
    const musician = await prisma.musician.findUnique({
      where: { id: musicianId },
      include: {
        user: {
          select: {
            imageUrl: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        bookings: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!musician) {
      return NextResponse.json(
        { error: "Musician not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(musician);
  } catch (error) {
    console.error("[GET_MUSICIAN_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
