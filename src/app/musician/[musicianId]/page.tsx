"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Musician = {
  id: string;
  name: string;
  genre: string;
  location: string;
  bio: string;
  mediaUrls: string[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
  }[];
  user: {
    imageUrl: string;
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

  if (!musician) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex gap-4 items-center">
        <Image
          src={musician.user?.imageUrl || "/default-avatar.png"}
          alt="Avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{musician.name}</h1>
          <p className="text-sm text-muted-foreground">
            {musician.genre} • {musician.location}
          </p>
        </div>
      </div>

      <p className="text-base">{musician.bio}</p>

      <div>
        <h2 className="text-lg font-semibold mb-2">Media</h2>
        <div className="grid grid-cols-2 gap-4">
          {musician.mediaUrls.map((url, i) => (
            <video key={i} src={url} controls className="rounded-lg w-full" />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Reviews</h2>
        <div className="space-y-2">
          {musician.reviews.length === 0 && <p>No reviews yet.</p>}
          {musician.reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-md bg-muted/30">
              <p className="font-medium">Rating: {review.rating}/5</p>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full mt-4" asChild>
        <a href={`/booking/request?musicianId=${musician.id}`}>
          Request Booking
        </a>
      </Button>
    </div>
  );
}
