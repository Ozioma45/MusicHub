"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type GenreCount = {
  genre: string;
  _count: { genre: number };
};

export default function PopularGenres() {
  const [genres, setGenres] = useState<GenreCount[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch("/api/genres/popular");
      if (res.ok) {
        setGenres(await res.json());
      }
    };
    fetchGenres();
  }, []);

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">🎵 Popular Genres</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {genres.map((g, idx) => (
          <Link
            key={idx}
            href={`/explore?genre=${encodeURIComponent(g.genre)}`}
            className="px-5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full"
          >
            {g.genre} ({g._count.genre})
          </Link>
        ))}
      </div>
    </section>
  );
}
