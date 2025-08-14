// app/dashboard/booker/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Search, User } from "lucide-react";
import Image from "next/image";
import SubscribeSection from "@/components/landing/SubscribeSection";
import RoleSwitcher from "@/components/Bookswitch";

export default async function BookerDashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // Pull the user and their linked booker profile
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: {
      booker: true,
      reviews: true,
      bookings: {
        include: { musician: { include: { user: true } } },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!dbUser || !dbUser.roles.includes("BOOKER")) {
    redirect("/dashboard");
  }

  const bookerProfile = dbUser.booker; // booker-specific info
  const profileImage =
    bookerProfile?.imageUrl || dbUser.imageUrl || "/default-avatar.png";

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

  const totalBookings = dbUser.bookings.length;
  const completedCount = dbUser.bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;
  const pendingCount = dbUser.bookings.filter(
    (b) => b.status === "PENDING"
  ).length;
  const reviewCount = dbUser.reviews.length;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Greeting Section */}
        <div className="bg-gradient-to-r from-blue-200 to-indigo-300 rounded-xl p-6 mb-8 shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back,{" "}
              <span className="text-blue-700">
                {bookerProfile?.name || dbUser.name || "Booker"}
              </span>
              !
            </h1>
            {bookerProfile?.location && (
              <p className="mt-1 flex items-center gap-1 opacity-90">
                <MapPin className="w-4 h-4" /> {bookerProfile.location}
              </p>
            )}
            {bookerProfile?.bio && (
              <p className="mt-1 opacity-90">{bookerProfile.bio}</p>
            )}
          </div>
          <Image
            src={profileImage}
            alt="Profile Picture"
            width={90}
            height={90}
            className="rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Bookings" value={totalBookings} />
          <StatCard label="Completed" value={completedCount} />
          <StatCard label="Reviews Written" value={reviewCount} />
          <StatCard label="Pending" value={pendingCount} />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 my-10 justify-between">
          <Link href="/explore">
            <Button className="bg-blue-600 text-white flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
              <Search className="w-4 h-4" /> Discover Musicians
            </Button>
          </Link>

          <Link href="./booker/profile">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer"
            >
              <User className="w-4 h-4" /> View Profile
            </Button>
          </Link>

          <RoleSwitcher />
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

        {/* Booking History */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Booking History</h2>
          {history.length === 0 ? (
            <p className="text-muted-foreground">No past bookings.</p>
          ) : (
            <div className="relative border-l border-gray-200 pl-6 space-y-8">
              {history.map((booking) => (
                <div key={booking.id} className="relative">
                  <span className="absolute -left-3 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></span>
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
