"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import { useUser } from "@clerk/nextjs"; // Clerk auth
import Link from "next/link";

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
  booker: {
    name: string;
    imageUrl: string;
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
  reviews: Review[];
  bookings: Booking[];
};

export default function MusicianProfilePage() {
  const { user } = useUser();
  const [musician, setMusician] = useState<Musician | null>(null);

  useEffect(() => {
    const fetchMusician = async () => {
      const res = await fetch(`/api/musician/profile`);
      const data = await res.json();
      setMusician(data);
    };
    fetchMusician();
  }, []);

  if (!musician) return <div>Loading...</div>;

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
                src={musician.imageUrl || "/default-avatar.png"}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full border-4 border-white"
              />
              <div className="text-white">
                <h1 className="text-2xl font-bold">{musician.name}</h1>
                <p>{musician.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Profile Overview</h2>
          <Link href="/dashboard/musician/edit">
            <Button className="cursor-pointer">Edit Profile</Button>
          </Link>
        </div>

        <section>
          <h3 className="text-lg font-medium mb-1">Bio</h3>
          <p>{musician.bio || "No bio available."}</p>
        </section>

        {musician.genre && (
          <section>
            <h3 className="text-lg font-medium mb-1">Genre</h3>
            <p>{musician.genre}</p>
          </section>
        )}

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
                      src={r.booker.imageUrl || "/default-avatar.png"}
                      alt={r.booker.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium">{r.booker.name}</span>
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
      </div>
    </MainLayout>
  );
}
