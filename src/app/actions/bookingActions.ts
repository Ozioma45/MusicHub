"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function handleBookingAction(formData: FormData) {
  const bookingId = formData.get("bookingId")?.toString();
  const action = formData.get("action") as "ACCEPTED" | "DECLINED" | null;

  if (!bookingId || !action) {
    throw new Error("Invalid form data");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: action },
  });

  // Refresh the musician dashboard so changes appear immediately
  revalidatePath("/musician/dashboard");
}
