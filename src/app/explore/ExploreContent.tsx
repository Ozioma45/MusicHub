"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface Musician {
  id: string;
  name: string;
  genre: string;
  location: string;
  coverImage?: string;
  instruments: string[];
}

interface GenreStat {
  genre: string;
  count: number;
}

type MusicianFilter = {
  name: string;
  genre: string;
  location: string;
};

export default function ExploreContent() {
  const searchParams = useSearchParams();
  const genreFromURL = searchParams.get("genre") || "";

  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [genres, setGenres] = useState<GenreStat[]>([]);
  const [filters, setFilters] = useState<MusicianFilter>({
    name: "",
    genre: genreFromURL,
    location: "",
  });

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch("/api/genres");
      if (res.ok) {
        const data = await res.json();
        setGenres(data);
      }
    };
    fetchGenres();
  }, []);

  // Fetch musicians
  useEffect(() => {
    const fetchMusicians = async () => {
      const queryObj = {
        ...filters,
        genre: filters.genre === "all" ? "" : filters.genre,
      };
      const query = new URLSearchParams(
        queryObj as Record<string, string>
      ).toString();
      const res = await fetch(`/api/musician/filter?${query}`);
      const data = await res.json();
      setMusicians(data);
    };

    fetchMusicians();
  }, [filters]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">
          {filters.genre
            ? `Musicians in ${filters.genre}`
            : "Explore Musicians"}
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch bg-white p-4 rounded-lg shadow-sm">
          <Input
            placeholder="Musician Name or Genre"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            className="flex-1"
          />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
            className="flex-1"
          />
          <Select
            value={filters.genre}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, genre: value }))
            }
          >
            <SelectTrigger className="w-full md:w-[200px]">Genre</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {genres.map((g) => (
                <SelectItem key={g.genre} value={g.genre}>
                  {g.genre} ({g.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
            Find Musicians
          </button>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-3">
          {genres.map((g) => (
            <button
              key={g.genre}
              onClick={() =>
                setFilters((prev) => ({ ...prev, genre: g.genre }))
              }
              className={`cursor-pointer px-4 py-2 rounded-full text-sm ${
                filters.genre === g.genre
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {g.genre} ({g.count})
            </button>
          ))}
        </div>

        {/* Musicians List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {musicians.map((musician) => (
            <div
              key={musician.id}
              className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden"
            >
              <div className="w-full h-40 relative">
                <Image
                  src={musician.coverImage || "/default-cover.jpg"}
                  alt={musician.name}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-lg font-semibold">{musician.name}</h3>
                <p className="text-sm text-gray-600">
                  {musician.instruments.join(", ")} • {musician.location}
                </p>
                <Link
                  href={`/musician/${musician.id}`}
                  className="text-blue-600 mt-2 inline-block"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
