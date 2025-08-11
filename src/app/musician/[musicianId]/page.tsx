"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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
  genre?: string;
  tags?: string[];
  imageUrl?: string;
  coverImage?: string;
  mediaUrls?: string[];
  reviews: Review[];
  bookings?: Booking[];
  user?: {
    imageUrl?: string;
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

  if (!musician) return <div className="text-center py-10">Loading...</div>;

  return (
    <MainLayout>
      {/* Cover */}
      <div className="relative h-30 md:h-40 lg:h-56 w-full">
        <Image
          src={musician.coverImage || "/default-cover.jpg"}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 flex items-end p-6">
          <div className="max-w-5xl w-full mx-auto">
            <div className="flex items-center gap-4">
              <Image
                src={
                  musician.imageUrl ||
                  musician.user?.imageUrl ||
                  "/default-avatar.png"
                }
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full border-4 border-white"
              />
              <div className="text-white">
                <h1 className="text-2xl font-bold">{musician.name}</h1>
                <p>
                  {musician.genre ? `${musician.genre} • ` : ""}
                  {musician.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Profile Overview</h2>
          <Link href={`/booking/request?musicianId=${musician.id}`}>
            <Button className="cursor-pointer bg-blue-600 text-white">
              Request Booking
            </Button>
          </Link>
        </div>

        {/* Bio */}
        <section>
          <h3 className="text-lg font-medium mb-1">Bio</h3>
          <p>{musician.bio || "No bio available."}</p>
        </section>

        {/* Genre */}
        {musician.genre && (
          <section>
            <h3 className="text-lg font-medium mb-1">Genre</h3>
            <p>{musician.genre}</p>
          </section>
        )}

        {/* Tags */}
        {musician.tags && musician.tags.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-1">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {musician.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Media */}
        {musician.mediaUrls && musician.mediaUrls.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-1">Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {musician.mediaUrls.map((url, i) => (
                <video
                  key={i}
                  src={url}
                  controls
                  className="rounded-lg w-full border"
                />
              ))}
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
              <ul className="space-y-2">
                {musician.bookings.map((b) => (
                  <li key={b.id} className="text-sm text-gray-700">
                    {b.eventType} - {b.location} (
                    {new Date(b.date).toDateString()})
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
                <div key={r.id} className="border-b pb-3">
                  <div className="flex gap-2 items-center">
                    <Image
                      src={r.user.imageUrl || "/default-avatar.png"}
                      alt={r.user.name || "Anonymous"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium">
                      {r.user.name || "Anonymous"}
                    </span>
                    <span className="text-yellow-500 text-sm">
                      ⭐ {r.rating}/5
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{r.comment}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toDateString()}
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
