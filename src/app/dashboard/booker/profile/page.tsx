// app/(dashboard)/booker/profile/page.tsx

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

export default async function BookerProfilePage() {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: clerkUser.id,
    },
  });

  if (!user || user.role !== "BOOKER") {
    redirect("/");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.imageUrl || "/placeholder-avatar.jpg"}
          alt={user.name || "Booker"}
          className="w-28 h-28 rounded-full object-cover border shadow"
        />
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-bold">
            {user.name || "Unnamed Booker"}
          </h2>
          <p className="text-muted-foreground">{user.email}</p>
          <Badge variant="outline">Booker</Badge>
          <p className="text-sm text-muted-foreground">
            Joined on {format(new Date(user.createdAt), "dd MMM, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex justify-center sm:justify-start">
        <Link href="/booker/edit-profile">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}
