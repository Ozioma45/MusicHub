// lib/notify.ts
import { prisma } from "@/lib/db";
import { sendNotificationEmail } from "@/lib/email";
import { NotificationType } from "@prisma/client";

export async function notifyUser({
  userId,
  type,
  title,
  message,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}) {
  // 1️⃣ Create notification in DB
  const notification = await prisma.notification.create({
    data: { userId, type, title, message },
  });

  // 2️⃣ Get user’s email
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  // 3️⃣ Send styled email
  if (user?.email) {
    await sendNotificationEmail(user.email, title, message, type);
  }

  return notification;
}
