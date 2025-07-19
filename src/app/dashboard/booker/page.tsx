// /app/dashboard/booker/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BookerDashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      bookings: {
        include: { musician: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!dbUser || dbUser.role !== "BOOKER") {
    redirect("/dashboard"); // fallback to dashboard if role mismatch
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">🎯 Your Booker Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Hello {dbUser.name || "there"}, manage your bookings and explore
          musicians.
        </p>

        <div className="flex gap-4 mb-6">
          <Link href="/explore">
            <Button>Explore Musicians</Button>
          </Link>
          <Link href="/book">
            <Button variant="outline">Request a Musician</Button>
          </Link>
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4">🎵 Your Bookings</h2>
        <div className="space-y-4">
          {dbUser.bookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings yet.</p>
          ) : (
            dbUser.bookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">
                  {booking.musician?.name || "Unknown Musician"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Event: {booking.eventType} | Location: {booking.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: {new Date(booking.date).toLocaleDateString()} | Status:{" "}
                  <span className="font-semibold">{booking.status}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
