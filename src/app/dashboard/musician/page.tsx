// /app/dashboard/musician/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";

export default async function MusicianDashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      musician: {
        include: {
          bookings: {
            include: { client: true },
            orderBy: { date: "desc" },
          },
        },
      },
    },
  });

  if (!dbUser || dbUser.role !== "MUSICIAN" || !dbUser.musician) {
    redirect("/dashboard");
  }

  const bookings = dbUser.musician.bookings;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">🎸 Your Musician Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Welcome {dbUser.name || "Musician"}, manage your gigs and booking
          requests here.
        </p>

        <div className="flex gap-4 mb-6">
          <Button variant="outline" asChild>
            <a href="/dashboard/musician/edit">Edit Profile</a>
          </Button>
          <Button asChild>
            <a href="/dashboard/musician/view">View Profile</a>
          </Button>
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4">
          📅 Booking Requests
        </h2>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">
                  🎤 Booking from {booking.client.name || "Unknown"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Event: {booking.eventType} | Location: {booking.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: {new Date(booking.date).toLocaleDateString()} | Status:{" "}
                  <span className="font-semibold">{booking.status}</span>
                </p>

                {/* Future: Add Accept/Decline buttons here */}
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
