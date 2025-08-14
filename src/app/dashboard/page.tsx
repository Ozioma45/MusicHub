import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Find user in DB
  let loggedUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  // Create user if they don't exist
  if (!loggedUser) {
    loggedUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.emailAddresses[0]?.emailAddress ?? "",
        imageUrl: user.imageUrl ?? "",
        roles: [],
        activeRole: null,
      },
    });
    redirect("/select-role");
  }

  // If no role is assigned yet
  if (!loggedUser.roles || loggedUser.roles.length === 0) {
    redirect("/select-role");
  }

  // Get the user's first role
  //const userRole = loggedUser.roles[0];

  // 4️⃣ If currentRole not set, default to first role & update DB
  if (!loggedUser.activeRole) {
    const defaultRole = loggedUser.roles[0];
    await prisma.user.update({
      where: { id: loggedUser.id },
      data: { activeRole: defaultRole },
    });
    loggedUser.activeRole = defaultRole;
  }

  // Route based on role
  switch (userRole) {
    case "MUSICIAN":
      redirect("/dashboard/musician");
      break;
    case "BOOKER":
      redirect("/dashboard/booker");
      break;
    default:
      redirect("/select-role"); // safety fallback
  }

  return null;
}
