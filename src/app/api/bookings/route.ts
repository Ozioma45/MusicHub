import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { musicianId, date, eventType, location, message } = body;

    if (!musicianId || !date || !eventType || !location) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Find the musician being booked
    const musician = await prisma.musician.findUnique({
      where: { id: musicianId },
      select: {
        user: {
          select: { clerkUserId: true },
        },
      },
    });

    if (!musician) {
      return NextResponse.json(
        { error: "Musician not found" },
        { status: 404 }
      );
    }

    // Prevent self-booking
    if (musician.user.clerkUserId === userId) {
      return NextResponse.json(
        { error: "You cannot book yourself" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        client: {
          connect: { clerkUserId: userId },
        },
        musician: {
          connect: { id: musicianId },
        },
        date: new Date(date),
        eventType,
        location,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking);
  } catch (err) {
    console.error("Booking Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
