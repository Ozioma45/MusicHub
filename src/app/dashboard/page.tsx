import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await currentUser();
  console.log(user);
  if (!user) {
    redirect("/sign-in");
  }

  const loggedUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!loggedUser) {
    await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        imageUrl: user.imageUrl ?? "",
      },
    });
    redirect("/select-role");
  }

  if (!loggedUser.role) {
    redirect("/select-role"); // User has no role yet
  }

  // Redirect to appropriate dashboard
  if (loggedUser.role === "MUSICIAN") {
    redirect("/dashboard/musician");
  } else if (loggedUser.role === "BOOKER") {
    redirect("/dashboard/booker");
  }

  return null;
}
