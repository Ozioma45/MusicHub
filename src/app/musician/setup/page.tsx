"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SetupMusicianPage() {
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    genre: "",
    location: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await axios.post("/api/musician/setup", {
      clerkUserId: user.id,
      ...form,
      mediaUrls: [], // start empty for now
    });

    router.push("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Complete Your Musician Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your stage name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre (e.g. Afrobeats, Gospel)"
          value={form.genre}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Your location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <textarea
          name="bio"
          placeholder="Tell us about yourself"
          value={form.bio}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded h-32"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
