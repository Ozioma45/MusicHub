import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function MusicianDashboard() {
  const user = await currentUser();
  if (!user) redirect("/");

  const loggedUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!loggedUser || loggedUser.role !== "MUSICIAN") {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🎸 Musician Dashboard</h1>
      <p>Welcome {user?.firstName}</p>
    </div>
  );
}
