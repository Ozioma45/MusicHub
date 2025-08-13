import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Search, User } from "lucide-react";
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

  if (!dbUser || !dbUser.roles.includes("BOOKER")) {
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
        <div className="bg-gradient-to-r from-blue-200 to-indigo-300 rounded-xl p-6 mb-8 shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back,{" "}
              <span className="text-blue-700">{dbUser.name || "Musician"}</span>
              !
            </h1>
            <p className="mt-1 opacity-90">
              Here’s a quick overview of your bookings. Let’s make more
              unforgettable events!
            </p>
          </div>
          <Image
            src={dbUser.imageUrl || "/default-avatar.png"}
            alt="Profile Picture"
            width={90}
            height={90}
            className="rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/explore">
            <Button className="bg-blue-600 text-white flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-blue-700">
              <Search className="w-4 h-4" /> Discover Musicians
            </Button>
          </Link>

          <Link href="/booker/profile">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 rounded-lg"
            >
              <User className="w-4 h-4" /> View Profile
            </Button>
          </Link>

          <Link href="/switch-to-musician">
            <Button variant="secondary" className="px-6 py-3 rounded-lg">
              Switch to Musician
            </Button>
          </Link>
        </div>

        {/* Upcoming Bookings */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">No upcoming bookings.</p>
            ) : (
              upcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-5 rounded-lg shadow-sm flex justify-between items-center gap-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={
                        booking.musician?.user?.imageUrl ||
                        "/default-avatar.png"
                      }
                      alt={booking.musician?.name || "Musician"}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <Link
                        href={`/musician/${booking.musician?.id}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {booking.musician?.name || "Unknown Musician"}
                      </Link>
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

        {/* Booking History - Timeline */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Booking History</h2>
          {history.length === 0 ? (
            <p className="text-muted-foreground">No past bookings.</p>
          ) : (
            <div className="relative border-l border-gray-200 pl-6 space-y-8">
              {history.map((booking) => (
                <div key={booking.id} className="relative">
                  <span className="absolute -left-3 w-6 h-6 bg-blue-500 rounded-full border-4 border-white"></span>
                  <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-2">
                      <Link
                        href={`/musician/${booking.musician?.id}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {booking.musician?.name || "Unknown Musician"}
                      </Link>
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
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
              ))}
            </div>
          )}
        </section>

        <div className="mt-12">
          <SubscribeSection />
        </div>
      </div>
    </MainLayout>
  );
}
