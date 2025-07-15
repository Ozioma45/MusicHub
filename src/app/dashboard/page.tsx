import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await currentUser();
  console.log(user);
  if (!user) {
    redirect("/");
  }

  const loggedUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!loggedUser) {
    await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        Welcome, {user?.firstName} to your dashboard 🎶
      </h1>
    </div>
  );
}
