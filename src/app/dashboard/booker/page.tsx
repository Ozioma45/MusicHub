import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import SubscribeSection from "@/components/landing/SubscribeSection";

export default async function BookerDashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      bookings: {
        include: { musician: { include: { user: true } } },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!dbUser || dbUser.role !== "BOOKER") {
    redirect("/dashboard");
  }

  const today = new Date();
  const upcoming = dbUser.bookings.filter(
    (b) =>
      ["PENDING", "ACCEPTED"].includes(b.status) && new Date(b.date) >= today
  );
  const history = dbUser.bookings.filter(
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
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Greeting Section */}
        <div className="bg-blue-100 rounded-xl p-6 mb-6">
          <div className="flex gap-4 items-center justify-between">
            {" "}
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back,{" "}
                <span className="text-blue-600">{dbUser.name || "there"}</span>!
              </h1>
              <p className="text-muted-foreground">
                Here's a quick overview of your bookings and favorite artists.
                Let&apos;s make more unforgettable events!
              </p>
            </div>
            <Image
              src={dbUser.imageUrl || "/default-avatar.png"}
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/explore">
            <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              Discover Musicians
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button
              variant="outline"
              className=" px-6 py-3 rounded-lg disabled:opacity-50"
            >
              View Profile
            </Button>
          </Link>
        </div>

        {/* Upcoming Bookings */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">No upcoming bookings.</p>
            ) : (
              upcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    {booking.musician?.user?.imageUrl ? (
                      <Image
                        src={booking.musician.user.imageUrl}
                        alt={booking.musician.name}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] rounded-full bg-gray-300" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.musician?.name || "Unknown Musician"}
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
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Booking History */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Booking History</h2>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-muted-foreground">No past bookings.</p>
            ) : (
              history.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    {booking.musician?.user?.imageUrl ? (
                      <Image
                        src={booking.musician.user.imageUrl}
                        alt={booking.musician.name}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] rounded-full bg-gray-300" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.musician?.name || "Unknown Musician"}
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
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
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
