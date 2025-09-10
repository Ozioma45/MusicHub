// /app/api/bookings/[id]/accept/route.ts
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const bookingId = params.id;

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "ACCEPTED" },
    include: { client: true, musician: { include: { user: true } } },
  });

  // 🔔 Notify client that their booking was accepted
  await prisma.notification.create({
    data: {
      userId: booking.clientId,
      type: "BOOKING",
      title: "Booking Accepted",
      message: `${booking.musician.name} accepted your booking request.`,
    },
  });

  return Response.json(booking);
}
