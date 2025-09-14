import { prisma } from "@/lib/db";
import { sendNotificationEmail } from "@/lib/email"; // from earlier setup
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
  // save notification
  const notification = await prisma.notification.create({
    data: { userId, type, title, message },
  });

  // find user email
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  // send email if available
  if (user?.email) {
    await sendNotificationEmail(user.email, title, message);
  }

  return notification;
}
