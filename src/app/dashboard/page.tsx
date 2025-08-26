import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email = user.emailAddresses[0]?.emailAddress ?? "";

  // 1️⃣ First check if user exists by Clerk ID
  let loggedUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  // 2️⃣ If not found, check by email
  if (!loggedUser && email) {
    loggedUser = await prisma.user.findUnique({
      where: { email },
    });

    // If email exists but clerkUserId is not set, update it
    if (loggedUser && !loggedUser.clerkUserId) {
      await prisma.user.update({
        where: { id: loggedUser.id },
        data: { clerkUserId: user.id },
      });
    }
  }

  // 3️⃣ If still not found, create a new user
  if (!loggedUser) {
    loggedUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email,
        imageUrl: user.imageUrl ?? "",
        roles: ["MUSICIAN", "BOOKER"],
        activeRole: null,
      },
    });
    redirect("/select-role");
  }

  // 4️⃣ If no role is assigned yet
  if (!loggedUser.roles) {
    redirect("/select-role");
  }

  // 5️⃣ Determine active role
  const userRole = loggedUser.activeRole || loggedUser.roles[0];
  if (!loggedUser.activeRole) {
    await prisma.user.update({
      where: { id: loggedUser.id },
      data: { activeRole: userRole },
    });
  }

  // 6️⃣ Route based on role
  switch (userRole) {
    case "MUSICIAN":
      redirect("/dashboard/musician");
      break;
    case "BOOKER":
      redirect("/dashboard/booker");
      break;
    default:
      redirect("/select-role");
  }

  return null;
}
