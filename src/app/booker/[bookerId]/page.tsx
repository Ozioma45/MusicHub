"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import SubscribeSection from "@/components/landing/SubscribeSection";

type Booking = {
  id: string;
  eventType: string;
  date: string;
  location: string;
  musician: {
    id: string;
    name: string;
    imageUrl: string;
  };
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  musician: {
    id: string;
    name: string;
    imageUrl: string;
  };
};

type Booker = {
  id: string;
  name: string;
  imageUrl?: string;
  bookings?: Booking[];
  reviews?: Review[];
};

export default function BookerProfilePage() {
  const { bookerId } = useParams();
  const [booker, setBooker] = useState<Booker | null>(null);

  useEffect(() => {
    const fetchBooker = async () => {
      const res = await fetch(`/api/booker/${bookerId}`);
      const data = await res.json();
      setBooker(data);
    };

    if (bookerId) fetchBooker();
  }, [bookerId]);

  if (!booker) return <div>Loading...</div>;

  return (
    <MainLayout>
      {/* Profile Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-10">
        <div className="max-w-5xl mx-auto px-6 md:px-10 flex items-center gap-6">
          <Image
            src={booker.imageUrl || "/default-avatar.png"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">{booker.name}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Past Bookings */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Past Bookings</h2>
          {booker.bookings && booker.bookings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {booker.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={booking.musician.imageUrl || "/default-avatar.png"}
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

        {/* Reviews Given */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Reviews Given</h2>
          {booker.reviews && booker.reviews.length > 0 ? (
            <div className="space-y-4">
              {booker.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <Image
                      src={review.musician.imageUrl || "/placeholder.png"}
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

        {/* Contact Button */}
        {/*  <div className="mt-6">
          <Button className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white">
            Contact {booker.name}
          </Button>
        </div> */}
        <SubscribeSection />
      </div>
    </MainLayout>
  );
}
