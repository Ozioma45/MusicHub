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

export default function ExplorePage() {
  const [musicians, setMusicians] = useState([]);
  const [filters, setFilters] = useState({ name: "", genre: "", location: "" });

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
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Explore Musicians</h1>

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
            <SelectItem value="Afrobeat">Afrobeat</SelectItem>
            <SelectItem value="Jazz">Jazz</SelectItem>
            <SelectItem value="Gospel">Gospel</SelectItem>
            <SelectItem value="Hip Hop">Hip Hop</SelectItem>
            {/* Add more genres as needed */}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {musicians.map((m: any) => (
          <Card key={m.id}>
            <CardContent className="p-4 space-y-1">
              <h3 className="font-semibold text-lg">{m.name}</h3>
              <p className="text-muted-foreground text-sm">
                {m.genre} · {m.location}
              </p>
              <p className="text-sm">{m.bio.slice(0, 60)}...</p>
              <Link
                href={`/musician/${m.id}`}
                className="text-blue-600 text-sm underline"
              >
                View Profile
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
