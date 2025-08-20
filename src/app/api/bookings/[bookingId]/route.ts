import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET /api/bookings/[bookingId]
export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // lookup booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        musician: {
          include: {
            user: true, // pulls the User record for the musician
          },
        },
        client: {
          // client = User
          include: {
            booker: true, // this pulls the Booker profile (1:1 with User)
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
