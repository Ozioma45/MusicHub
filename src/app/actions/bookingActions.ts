"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notifyUser } from "@/lib/notify";

export async function handleBookingAction(formData: FormData) {
  const bookingId = formData.get("bookingId")?.toString();
  const action = formData.get("action") as "ACCEPTED" | "DECLINED" | null;

  if (!bookingId || !action) {
    throw new Error("Invalid form data");
  }

  // Update booking and include related data for notification
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: action },
    include: { client: true, musician: { include: { user: true } } },
  });

  // 🔔 Send notification to client
  if (action === "ACCEPTED") {
    await notifyUser({
      userId: booking.clientId,
      type: "BOOKING",
      title: "Booking Accepted",
      message: `${booking.musician.name} accepted your booking request.`,
    });
  }

  if (action === "DECLINED") {
    await notifyUser({
      userId: booking.clientId,
      type: "BOOKING",
      title: "Booking Declined",
      message: `${booking.musician.name} declined your booking request.`,
    });
  }

  // Refresh the musician dashboard so changes appear immediately
  revalidatePath("/musician/dashboard");
}
