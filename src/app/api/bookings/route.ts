import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { musicianId, date, eventType, location, message } = body;

  try {
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
