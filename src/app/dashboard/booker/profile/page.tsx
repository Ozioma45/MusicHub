import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import SubscribeSection from "@/components/landing/SubscribeSection";
import MainLayout from "@/components/MainLayout";
import EditProfileButton from "./EditProfileModal";
import EditProfileModal from "./EditProfileModal";

export default async function BookerProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: {
      bookings: {
        include: {
          musician: {
            include: { user: true },
          },
        },
      },
      reviews: {
        include: {
          musician: {
            include: { user: true },
          },
        },
      },
    },
  });

  if (!user || !user.roles.includes("BOOKER")) {
    redirect("/");
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image
              src={user.imageUrl || "/default-avatar.png"}
              alt={user.name || "Booker"}
              width={120}
              height={120}
              className="rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-3xl font-bold">
                {user.name || "Unnamed Booker"}
              </h2>
              <p className="opacity-90">{user.email}</p>
              <Badge className="bg-white text-blue-700 font-medium">
                Booker
              </Badge>
              <p className="text-sm opacity-80 flex items-center gap-1">
                <CalendarDays size={16} /> Joined on{" "}
                {format(new Date(user.createdAt), "dd MMM, yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Bookings" value={user.bookings.length} />
          <StatCard
            label="Completed"
            value={user.bookings.filter((b) => b.status === "COMPLETED").length}
          />
          <StatCard label="Reviews Written" value={user.reviews.length} />
          <StatCard
            label="Pending"
            value={user.bookings.filter((b) => b.status === "PENDING").length}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <EditProfileModal />
          <Link href="/explore">
            <Button variant="outline" className="px-6">
              Discover Musicians
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto p-6 space-y-10">
          <BookingSection bookings={user.bookings} />
          <ReviewSection reviews={user.reviews} />
        </div>

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

function BookingSection({ bookings }: { bookings: any[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Past Bookings</h2>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow hover:shadow-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src={booking.musician.user.imageUrl || "/default-avatar.png"}
                  alt={booking.musician.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{booking.musician.name}</p>
                  <p className="text-xs text-gray-500">
                    {booking.eventType} •{" "}
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{booking.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No bookings yet.</p>
      )}
    </section>
  );
}

function ReviewSection({ reviews }: { reviews: any[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Reviews Given</h2>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center gap-3 mb-1">
                <Image
                  src={review.musician.user.imageUrl || "/default-avatar.png"}
                  alt={review.musician.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-medium">{review.musician.name}</span>
              </div>
              <div className="text-yellow-500">⭐ {review.rating}/5</div>
              <p className="text-gray-700 mt-1">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </section>
  );
}
