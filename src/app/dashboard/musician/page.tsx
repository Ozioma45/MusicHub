import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import SubscribeSection from "@/components/landing/SubscribeSection";
import { handleBookingAction } from "@/app/actions/bookingActions";

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

  if (!dbUser || !dbUser.roles.includes("MUSICIAN")) {
    redirect("/dashboard");
  }

  const musician = dbUser.musician;
  const bookings = musician?.bookings || [];
  const today = new Date();

  const upcoming = bookings.filter(
    (b) =>
      ["PENDING", "ACCEPTED"].includes(b.status) && new Date(b.date) >= today
  );

  const history = bookings.filter(
    (b) =>
      ["DECLINED", "CANCELLED", "COMPLETED"].includes(b.status) ||
      (new Date(b.date) < today && b.status !== "ACCEPTED")
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "DECLINED":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Greeting */}
        <div className="bg-blue-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back,{" "}
              <span className="text-blue-600">{dbUser.name || "Musician"}</span>
              !
            </h1>
            <p className="text-muted-foreground">
              Manage your bookings, view past performances, and connect with
              bookers.
            </p>
          </div>
          <Image
            src={dbUser.imageUrl || "/default-avatar.png"}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="./musician/profile">
            <Button variant="outline" className="px-6 py-3 rounded-lg">
              View Profile
            </Button>
          </Link>
          <Link href="./musician/edit">
            <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Edit Profile
            </Button>
          </Link>
          <Link href="/switch-to-booker">
            <Button variant="secondary" className="px-6 py-3 rounded-lg">
              Switch to Booker
            </Button>
          </Link>
        </div>

        {/* Upcoming Bookings */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Gigs</h2>
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">No upcoming gigs.</p>
            ) : (
              upcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    {booking.client?.imageUrl ? (
                      <Image
                        src={booking.client.imageUrl}
                        alt={booking.client.name || "Booker"}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] rounded-full bg-gray-300" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        <Link href={`/booker/${booking.client?.id || "#"}`}>
                          {booking.client.name || "Unknown Booker"}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {booking.location} • {booking.eventType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    {booking.status === "PENDING" ? (
                      <>
                        <form action={handleBookingAction}>
                          <input
                            type="hidden"
                            name="bookingId"
                            value={booking.id}
                          />
                          <input type="hidden" name="action" value="ACCEPTED" />
                          <Button className="bg-green-600 hover:bg-green-700 text-white text-sm cursor-pointer">
                            Accept
                          </Button>
                        </form>
                        <form action={handleBookingAction}>
                          <input
                            type="hidden"
                            name="bookingId"
                            value={booking.id}
                          />
                          <input type="hidden" name="action" value="DECLINED" />
                          <Button
                            variant="destructive"
                            className="text-sm cursor-pointer"
                          >
                            Decline
                          </Button>
                        </form>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Past Gigs */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Past Gigs</h2>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-muted-foreground">No past gigs.</p>
            ) : (
              history.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    {booking.client?.imageUrl ? (
                      <Image
                        src={booking.client.imageUrl}
                        alt={booking.client.name || "Booker"}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] rounded-full bg-gray-300" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        <Link href={`/booker/${booking.client?.id || "#"}`}>
                          {booking.client.name || "Unknown Booker"}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {booking.location} • {booking.eventType}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <SubscribeSection />
      </div>
    </MainLayout>
  );
}
