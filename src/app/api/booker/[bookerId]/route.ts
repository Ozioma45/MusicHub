import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// GET booker profile by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookerId: string }> }
) {
  try {
    const { bookerId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: bookerId },
      include: {
        booker: true,
        bookings: {
          include: {
            musician: { include: { user: true } },
          },
        },
        reviews: {
          include: {
            musician: { include: { user: true } },
          },
        },
      },
    });

    // Ensure it's a booker and has a profile
    if (!user || !user.roles.includes("BOOKER") || !user.booker) {
      return NextResponse.json({ error: "Booker not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.booker.name,
      email: user.email,
      imageUrl: user.booker.imageUrl,
      coverImage: user.booker.coverImage,
      location: user.booker.location,
      bio: user.booker.bio,
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
