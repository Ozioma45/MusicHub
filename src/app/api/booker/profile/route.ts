import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET booker profile
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
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

    if (!user || !user.roles.includes("BOOKER") || !user.booker) {
      return NextResponse.json({ error: "Not a booker" }, { status: 403 });
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

// PUT update booker profile
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, location, bio, imageUrl, coverImage } = data;

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { booker: true },
    });

    if (!user || !user.roles.includes("BOOKER") || !user.booker) {
      return NextResponse.json({ error: "Not a booker" }, { status: 403 });
    }

    // Update Booker profile
    await prisma.booker.update({
      where: { id: user.booker.id },
      data: { name, location, bio, imageUrl, coverImage },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating booker profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
