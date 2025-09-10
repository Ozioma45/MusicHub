import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: { id: string } };

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const notification = await prisma.notification.update({
    where: { id: params.id },
    data: { read: true },
  });

  return Response.json(notification);
}

export async function PATCH(req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const notification = await prisma.notification.updateMany({
    where: { id: params.id, userId: user.id },
    data: { read: true },
  });

  return NextResponse.json(notification);
}
