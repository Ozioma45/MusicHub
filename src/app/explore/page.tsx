"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";

export default function ExplorePage({
  searchParams,
}: {
  searchParams?: { genre?: string };
}) {
  const [musicians, setMusicians] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    genre: searchParams?.genre || "",
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
      const query = new URLSearchParams(queryObj as any).toString();
      const res = await fetch(`/api/musician/filter?${query}`);
      const data = await res.json();
      setMusicians(data);
    };

    fetchMusicians();
  }, [filters]);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">
          {filters.genre
            ? `Musicians in ${filters.genre}`
            : "Explore Musicians"}
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            placeholder="Location..."
            value={filters.location}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
          />
          <Select
            value={filters.genre}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, genre: value }))
            }
          >
            <SelectTrigger className="w-[200px]">Select Genre</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {genres.map((g: any, i) => (
                <SelectItem key={i} value={g.genre}>
                  {g.genre} ({g._count.genre})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Genre Tags (Popular Genres) */}
        <div className="flex flex-wrap gap-3">
          {genres.map((g: any, idx) => (
            <button
              key={idx}
              onClick={() =>
                setFilters((prev) => ({ ...prev, genre: g.genre }))
              }
              className={`cursor-pointer px-4 py-2 rounded-full text-sm ${
                filters.genre === g.genre
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {g.genre} ({g._count.genre})
            </button>
          ))}
        </div>

        {/* Musicians List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {musicians.map((musician: any) => (
            <div
              key={musician.id}
              className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden"
            >
              <img
                src={musician.coverImage || "/default-cover.jpg"}
                alt={musician.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-left">
                <h3 className="text-lg font-semibold">{musician.name}</h3>
                <p className="text-sm text-gray-600">
                  {musician.genre} • {musician.location}
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
