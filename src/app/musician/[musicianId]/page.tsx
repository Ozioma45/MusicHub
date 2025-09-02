"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Calendar, MapPin, CalendarDays } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import SubscribeSection from "@/components/landing/SubscribeSection";

type Booking = {
  id: string;
  eventType: string;
  date: string;
  location: string;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    imageUrl?: string;
  };
};

type Musician = {
  id: string;
  name: string;
  location: string;
  bio: string;
  genres: string[];
  instruments: string[];
  services: string[];
  imageUrl?: string;
  coverImage?: string;
  mediaUrls?: string[];
  reviews: Review[];
  bookings?: Booking[];
  user: {
    imageUrl: string;
    name: string;
    email: string;
    createdAt: string;
  };
};

export default function MusicianProfilePage() {
  const { musicianId } = useParams();
  const [musician, setMusician] = useState<Musician | null>(null);

  useEffect(() => {
    const fetchMusician = async () => {
      const res = await fetch(`/api/musician/${musicianId}`);
      const data = await res.json();
      setMusician(data);
    };
    if (musicianId) fetchMusician();
  }, [musicianId]);

  function StarRating({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={clsx(
              "w-4 h-4",
              rating >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            )}
          />
        ))}
      </div>
    );
  }

  if (!musician) return <div className="text-center py-10">Loading...</div>;

  return (
    <MainLayout>
      {/* Cover */}
      <div className="relative h-60 md:h-60 lg:h-70 w-full">
        <Image
          src={musician.coverImage || "/default-cover.jpg"}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80 flex items-end">
          <div className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center gap-6 p-6 justify-between">
            <div className="flex items-center gap-6 p-6 text-white">
              <Image
                src={musician.user.imageUrl || "/default-avatar.png"}
                alt={musician.name}
                width={110}
                height={110}
                className="rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-white">
                <h1 className="text-2xl font-bold">{musician.name}</h1>
                <p className="opacity-90">{musician.user.email}</p>
                <p className="text-lg opacity-90 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {musician.location}
                </p>
                <p className="text-sm opacity-80 flex items-center gap-1">
                  <CalendarDays size={16} /> Joined on{" "}
                  {format(new Date(musician.user.createdAt), "dd MMM, yyyy")}
                </p>
                {/* {musician.genres?.length > 0 && (
                <p className="text-sm mt-1 italic">
                  {musician.genres.join(" • ")}
                </p>
              )} */}
              </div>
            </div>
            <p className="bg-white text-black px-3 py-1 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 hover:text-white font-bold cursor-pointer">
              Musician
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {/* Overview + Booking CTA */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-semibold">Profile Overview</h2>

              <div className="flex gap-4">
                {/*{" "}
                <Link href={`/review/submit?musicianId=${musician.id}`}>
                  <Button>Submit Review</Button>
                </Link>{" "}
                */}
                <Link href={`/booking/request?musicianId=${musician.id}`}>
                  <Button className="bg-blue-600 text-white">
                    Request Booking
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bio */}
            <section>
              <h3 className="text-lg font-medium mb-1">Bio</h3>
              <p>{musician.bio || "No bio available."}</p>
            </section>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm space-y-5">
            {/* Genres */}
            {musician.genres?.length > 0 && (
              <section>
                <h3 className="text-lg font-medium mb-1">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {musician.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Instruments */}
            {musician.instruments?.length > 0 && (
              <section>
                <h3 className="text-lg font-medium mb-1">Instruments</h3>
                <div className="flex flex-wrap gap-2">
                  {musician.instruments.map((instrument, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 text-sm rounded-full"
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {musician.services?.length > 0 && (
              <section>
                <h3 className="text-lg font-medium mb-1">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {musician.services.map((service, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 text-sm rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Media */}
        {musician.mediaUrls && musician.mediaUrls.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-1">Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {musician.mediaUrls.map((url, i) =>
                url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <div className="relative" key={i}>
                    <video
                      key={i}
                      src={url}
                      controls
                      className="rounded-lg w-full border shadow-sm aspect-video object-cover"
                    />
                  </div>
                ) : (
                  <Image
                    key={i}
                    src={url}
                    alt={`Media ${i + 1}`}
                    width={600}
                    height={400}
                    className="rounded-lg border object-cover"
                  />
                )
              )}
            </div>
          </section>
        )}

        {/* Booking History */}
        {musician.bookings && (
          <section>
            <h3 className="text-lg font-medium mb-2">Booking History</h3>
            {musician.bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <ul className="space-y-3 border-l pl-4">
                {musician.bookings.map((b) => (
                  <li key={b.id} className="relative">
                    <span className="absolute -left-2 top-2 w-3 h-3 bg-blue-500 rounded-full"></span>
                    <div className="text-sm">
                      <p className="font-semibold">{b.eventType}</p>
                      <p className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(b.date).toDateString()} • {b.location}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Reviews */}
        <section>
          <h3 className="text-lg font-medium mb-2">Reviews</h3>
          {musician.reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {musician.reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-lg border bg-gray-50 dark:bg-neutral-800"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={r.user.imageUrl || "/default-avatar.png"}
                      alt={r.user.name || "Anonymous"}
                      width={40}
                      height={40}
                      className="rounded-full border"
                    />
                    <div>
                      <p className="font-semibold">
                        {r.user.name || "Anonymous"}
                      </p>
                      <StarRating rating={r.rating} />
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {r.comment}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            asChild
            className="w-full md:w-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Link href={`/booking/request?musicianId=${musician.id}`}>
              Request Booking
            </Link>
          </Button>
          <Button asChild className="w-full md:w-1/2" variant="outline">
            <Link href={`/review/submit?musicianId=${musician.id}`}>
              Submit Review
            </Link>
          </Button>
        </div>

        <SubscribeSection />
      </div>
    </MainLayout>
  );
}
