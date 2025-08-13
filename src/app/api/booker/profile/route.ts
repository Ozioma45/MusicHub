import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        bookings: {
          include: {
            musician: {
              include: { user: true },
            },
          },
        },
        reviews: {
          include: {
            musician: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!user || !user.roles.includes("BOOKER")) {
      return NextResponse.json({ error: "Not a booker" }, { status: 403 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      bookings: user.bookings,
      reviews: user.reviews,
      stats: {
        totalBookings: user.bookings.length,
        completedBookings: user.bookings.filter((b) => b.status === "COMPLETED")
          .length,
        pendingBookings: user.bookings.filter((b) => b.status === "PENDING")
          .length,
        reviewsWritten: user.reviews.length,
      },
    });
  } catch (error) {
    console.error("Error fetching booker profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
