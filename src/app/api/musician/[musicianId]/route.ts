import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { musicianId: string } }
) {
  const musicianId = context.params.musicianId;

  try {
    const musician = await prisma.musician.findUnique({
      where: { id: musicianId },
      include: {
        user: true,
        reviews: {
          include: {
            user: true,
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
