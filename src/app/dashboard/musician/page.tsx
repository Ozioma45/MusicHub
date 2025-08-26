import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import Image from "next/image";
import SubscribeSection from "@/components/landing/SubscribeSection";
import { handleBookingAction } from "@/app/actions/bookingActions";
import RoleSwitcher from "@/components/MusicSwitch";
import MessageBookerButton from "@/components/MessgaeBookerButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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
      reviews: true,
    },
  });

  if (!dbUser || dbUser.activeRole !== "MUSICIAN") {
    redirect("/dashboard");
  }

  // Check if the booker profile exists
  if (!dbUser.musician) {
    redirect("/musician/setup");
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

  const totalBookings = bookings.length;
  const completedCount = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const reviewCount = dbUser.reviews.length;

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
        <div className="bg-gradient-to-r from-blue-200 to-indigo-300 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
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

          <Link href="./musician/profile">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer"
            >
              <User className="w-4 h-4" /> View Profile
            </Button>
          </Link>

          <RoleSwitcher />
        </div>

        {/* Upcoming & Past Gigs */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Gigs</h2>
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">No upcoming gigs.</p>
            ) : (
              upcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-start"
                >
                  {/* Booker Info */}
                  <div className="flex items-start gap-3">
                    {booking.client?.imageUrl ? (
                      <Image
                        src={booking.client.imageUrl}
                        alt={booking.client.name || "Booker"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {booking.client?.name || "Unknown Booker"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.client?.email || "No email"}
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
                        <Link href={`/booker/${booking.client?.id}`}>
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/bookings/${booking.id}`}>
                          Booking Details
                        </Link>
                      </DropdownMenuItem>
                      <MessageBookerButton bookerId={booking.client?.id!} />

                      <DropdownMenuSeparator />

                      {booking.status === "PENDING" && (
                        <div className="flex gap-2 px-2 py-1">
                          <form action={handleBookingAction} className="flex-1">
                            <input
                              type="hidden"
                              name="bookingId"
                              value={booking.id}
                            />
                            <input
                              type="hidden"
                              name="action"
                              value="ACCEPTED"
                            />
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                              size="sm"
                            >
                              Accept
                            </Button>
                          </form>
                          <form action={handleBookingAction} className="flex-1">
                            <input
                              type="hidden"
                              name="bookingId"
                              value={booking.id}
                            />
                            <input
                              type="hidden"
                              name="action"
                              value="DECLINED"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full text-sm"
                            >
                              Decline
                            </Button>
                          </form>
                        </div>
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
          <h2 className="text-xl font-semibold mb-4">Past Gigs</h2>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-muted-foreground">No past gigs yet.</p>
            ) : (
              history.map((booking) => (
                <div
                  key={booking.id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-start"
                >
                  {/* Booker Info */}
                  <div className="flex items-start gap-3">
                    {booking.client?.imageUrl ? (
                      <Image
                        src={booking.client.imageUrl}
                        alt={booking.client.name || "Booker"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {booking.client?.name || "Unknown Booker"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.client?.email || "No email"}
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
                        <Link href={`/booker/${booking.client?.id}`}>
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/bookings/${booking.id}`}>
                          Booking Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/messages/${booking.client?.id}`}>
                          Message Booker
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
