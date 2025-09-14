// app/dashboard/booker/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SubscribeSection from "@/components/landing/SubscribeSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import MessageMusicianButton from "@/components/MessageMusicianButton";
import DashboardLayout from "@/components/DashboardLayout";

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

  if (!dbUser || dbUser.activeRole !== "BOOKER") {
    redirect("/dashboard");
  }

  // Check if the booker profile exists
  if (!dbUser.booker) {
    redirect("/booker/setup");
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
    <DashboardLayout role="BOOKER">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Greeting Section */}
        <div className="bg-gradient-to-r from-purple-200 to-indigo-300 rounded-xl p-6 mb-8 shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back,{" "}
              <span className="text-blue-700">
                {bookerProfile?.name || dbUser.name || "Booker"}
              </span>
              !
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s a quick overview of your bookings and favorite
              artists. Let&apos;s make more unforgettable events!
            </p>
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
        {/* <div className="flex flex-wrap gap-4 my-10 justify-between">
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
        </div> */}

        {/* Upcoming Bookings */}

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">No upcoming Bookings.</p>
            ) : (
              upcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-start"
                >
                  {/* Booker Info */}
                  <div className="flex items-start gap-3">
                    {booking.musician?.user?.imageUrl ? (
                      <Image
                        src={booking.musician?.user?.imageUrl}
                        alt={booking.musician?.name || "Booker"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {booking.musician?.name || "Unknown Booker"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.musician?.user?.email || "No email"}
                      </p>

                      {/* Status Badge under info */}
                      {/*  <Badge
                        variant={
                          booking.status === "ACCEPTED"
                            ? "default"
                            : booking.status === "DECLINED"
                            ? "destructive"
                            : "secondary"
                        }
                        className="mt-1"
                      >
                        {booking.status}
                      </Badge> */}
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* 3-Dot Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/musician/${booking.musician?.id}`}>
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/bookings/${booking.id}`}>
                          Booking Details
                        </Link>
                      </DropdownMenuItem>
                      {booking.musician?.user?.id && (
                        <MessageMusicianButton
                          musicianUserId={booking.musician.user.id}
                        />
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Past Gigs */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Booking History</h2>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-muted-foreground">No past Bookings.</p>
            ) : (
              history.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-start"
                >
                  {/* Booker Info */}
                  <div className="flex items-start gap-3">
                    {booking.musician?.user?.imageUrl ? (
                      <Image
                        src={booking.musician?.user?.imageUrl}
                        alt={booking.musician?.name || "Booker"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {booking.musician?.name || "Unknown Booker"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.musician?.user?.email || "No email"}
                      </p>

                      {/* Status Badge */}
                      {/* <Badge
                                variant={
                                  booking.status === "COMPLETED"
                                    ? "default"
                                    : "secondary"
                                }
                                className="mt-1"
                              >
                                {booking.status}
                              </Badge> */}
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* 3-Dot Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/musician/${booking.musician?.id}`}>
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/bookings/${booking.id}`}>
                          Booking Details
                        </Link>
                      </DropdownMenuItem>
                      {booking.musician?.user?.id && (
                        <MessageMusicianButton
                          musicianUserId={booking.musician.user.id}
                        />
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="mt-12">
          <SubscribeSection />
        </div>
      </div>
    </DashboardLayout>
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
