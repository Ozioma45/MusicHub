"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function handleBookingAction(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  const action = formData.get("action") as "ACCEPTED" | "DECLINED";

  if (!bookingId || !action) {
    throw new Error("Invalid form data");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: action },
  });

  redirect("/musician/dashboard");
}
