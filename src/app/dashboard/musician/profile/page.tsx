"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
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
  genres: string[];
  instruments: string[];
  services: string[];
  tags?: string[];
  imageUrl?: string;
  coverImage?: string;
  mediaUrls?: string[];
  reviews: Review[];
  bookings: Booking[];
};

export default function MusicianProfilePage() {
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
      {/* Hero Section */}
      <div className="relative w-full h-40 md:h-50 lg:h-60">
        <Image
          src={musician.coverImage || "/default-cover.jpg"}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80 flex items-end">
          <div className="max-w-6xl mx-auto w-full flex items-center gap-6 p-6">
            <Image
              src={musician.imageUrl || "/default-avatar.png"}
              alt={musician.name}
              width={110}
              height={110}
              className="rounded-full border-4 border-white shadow-lg"
            />
            <div className="text-white">
              <h1 className="text-3xl font-bold">{musician.name}</h1>
              <p className="text-lg opacity-90">{musician.location}</p>
              {musician.genres?.length > 0 && (
                <p className="text-sm mt-1 italic">
                  {musician.genres.join(" • ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bio */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">About {musician.name}</h2>
            <p className="text-gray-700 leading-relaxed">{musician.bio}</p>
          </div>

          {/* Skills & Expertise */}
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm space-y-5">
            {musician.genres?.length > 0 && (
              <div>
                <h3 className="font-medium mb-1">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {musician.genres.map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border rounded-full text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {musician.instruments?.length > 0 && (
              <div>
                <h3 className="font-medium mb-1">Instruments</h3>
                <div className="flex flex-wrap gap-2">
                  {musician.instruments.map((inst, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border rounded-full text-sm"
                    >
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {musician.services?.length > 0 && (
              <div>
                <h3 className="font-medium mb-1">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {musician.services.map((svc, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border rounded-full text-sm"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media */}
        {musician.mediaUrls && musician.mediaUrls.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">My Music</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {musician.mediaUrls.map((url, i) => (
                <div className="relative" key={i}>
                  <video
                    key={i}
                    src={url}
                    controls
                    className="rounded-lg w-full border shadow-sm aspect-video object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Past Events & Performances
          </h2>
          {musician.bookings.length === 0 ? (
            <p>No events yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {musician.bookings.map((b) => (
                <div key={b.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="font-medium">{b.eventType}</p>
                  <p className="text-sm text-gray-600">{b.location}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(b.date).toDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-xl font-semibold mb-4">What People Say</h2>
          {musician.reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {musician.reviews.map((r) => (
                <div key={r.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <Image
                      src={r.booker.imageUrl || "/default-avatar.png"}
                      alt={r.booker.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{r.booker.name}</p>
                      <p className="text-yellow-500 text-sm">⭐ {r.rating}/5</p>
                    </div>
                  </div>
                  <p className="mt-2 italic text-gray-700">"{r.comment}"</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.createdAt).toDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="./edit">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Edit Your Profile
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
