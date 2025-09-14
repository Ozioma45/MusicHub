import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import SubscribeSection from "@/components/landing/SubscribeSection";
import DashboardLayout from "@/components/DashboardLayout";

export default async function BookerProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: {
      booker: true,
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

  const bookerProfile = user.booker;
  const profileImage =
    bookerProfile?.imageUrl || user.imageUrl || "/default-avatar.png";
  const bookerLocation = bookerProfile?.location || " No location Provided";

  return (
    <DashboardLayout role="BOOKER">
      {/* Hero Section */}
      <div className="relative w-full h-60 md:h-40 lg:h-50">
        <Image
          src={bookerProfile?.coverImage || "/default-cover.jpg"}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/100 flex items-end">
          <div className="max-w-5xl mx-auto flex justify-between flex-col sm:flex-row w-full items-center gap-3 py-6 sm:gap-6 sm:p-6">
            <div className="flex items-center gap-3 p-3 sm:gap-6 sm:p-6 text-white">
              <Image
                src={profileImage}
                alt={user.name || "BOOKER"}
                width={110}
                height={110}
                className="rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-left">
                <h2 className="text-2xl font-bold">
                  {bookerProfile?.name || "Unnamed Booker"}
                </h2>
                <p className="opacity-90">{user.email}</p>
                <p className="text-lg opacity-90 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {bookerLocation}
                </p>
                <p className="text-sm opacity-80 flex items-center gap-1">
                  <CalendarDays size={16} /> Joined on{" "}
                  {format(new Date(user.createdAt), "dd MMM, yyyy")}
                </p>
              </div>
            </div>

            <p className="bg-white text-black px-3 py-1 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 hover:text-white font-bold cursor-pointer">
              BOOKER
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bio */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">
              About {bookerProfile?.name}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {bookerProfile?.bio || "No bio provided."}
            </p>
          </div>
          <div>
            <BookingSection bookings={user.bookings} />
          </div>
        </div>

        <ReviewSection reviews={user.reviews} />

        {/* CTA */}
        {/* <div className="text-center">
          <Link href="./edit">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Edit Your Profile
            </Button>
          </Link>
        </div> */}
      </div>
      <SubscribeSection />
    </DashboardLayout>
  );
}

function BookingSection({
  bookings,
}: {
  bookings: {
    id: string;
    eventType: string;
    date: Date;
    location: string;
    musician: { name: string; user: { imageUrl: string | null } };
  }[];
}) {
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

function ReviewSection({
  reviews,
}: {
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    musician: { name: string; user: { imageUrl: string | null } };
  }[];
}) {
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
