import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  console.log("Review payload:", body);

  const { musicianId, rating, comment } = body;

  if (!musicianId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: {
        musicianId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (err) {
    console.error("Review error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
