"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import MainLayout from "@/components/MainLayout";
import SubscribeSection from "@/components/landing/SubscribeSection";

type Musician = {
  id: string;
  name: string;
  genre: string;
  location: string;
  bio: string;
  coverImage?: string;
  mediaUrls: string[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string;
      imageUrl: string;
    };
  }[];
  user: {
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
      {/* Cover Section */}
      <div className="relative w-full h-30 md:h-40 lg:h-50">
        <Image
          src={musician.coverImage || "/default-cover.jpg"}
          alt="Cover Image"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 flex flex-col justify-end p-6 md:p-10">
          <div className="max-w-5xl mx-auto w-full px-6 md:px-10">
            <div className="flex items-center gap-4">
              <Image
                src={musician.user?.imageUrl || "/default-avatar.png"}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {musician.name}
                </h1>
                <p className="text-white/90 text-sm md:text-base">
                  {musician.genre} • {musician.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-10">
        {/* About */}
        <section>
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <p className="text-gray-700 leading-relaxed">{musician.bio}</p>
          </div>
        </section>

        {/* Media */}
        {musician.mediaUrls.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Media</h2>
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

        {/* Reviews */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Reviews</h2>
          {musician.reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {musician.reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3 mb-1">
                    <Image
                      src={review.user.imageUrl || "/placeholder.png"}
                      alt={review.user.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-medium">
                      {review.user.name || "Anonymous"}
                    </span>
                  </div>
                  <div className="text-yellow-500">⭐ {review.rating}/5</div>
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
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
            className="w-full md:w-1/2  bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <a href={`/booking/request?musicianId=${musician.id}`}>
              Request Booking
            </a>
          </Button>
          <Button asChild className="w-full md:w-1/2" variant="outline">
            <a href={`/review/submit?musicianId=${musician.id}`}>
              Submit Review
            </a>
          </Button>
        </div>
      </div>

      <SubscribeSection />
    </MainLayout>
  );
}
