"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Music } from "lucide-react";

type CloudinaryResult = {
  event: string;
  info: { secure_url: string };
};

export default function SetupMusicianPage() {
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    genres: [] as string[],
    instruments: [] as string[],
    services: [] as string[],
    location: "",
    bio: "",
    coverImage: "",
  });

  const [genreInput, setGenreInput] = useState("");
  const [instrumentInput, setInstrumentInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

  const handleAddTag = (
    field: "genres" | "instruments" | "services",
    value: string
  ) => {
    if (!value.trim()) return;
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    if (field === "genres") setGenreInput("");
    if (field === "instruments") setInstrumentInput("");
    if (field === "services") setServiceInput("");
  };

  const handleRemoveTag = (
    field: "genres" | "instruments" | "services",
    index: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = () => {
    // @ts-expect-error: Cloudinary widget global
    if (!window.cloudinary) {
      console.error("Cloudinary widget not loaded.");
      return;
    }

    // @ts-expect-error: Cloudinary widget global
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "musiconnect",
        sources: ["local", "url", "camera"],
        cropping: true,
        multiple: false,
        folder: "musicians",
      },
      (error: Error | null, result: CloudinaryResult) => {
        if (!error && result && result.event === "success") {
          setForm((prev) => ({
            ...prev,
            coverImage: result.info.secure_url,
          }));
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    /*  if (form.bio.trim().length < 20) {
      alert("Your bio must be at least 20 characters long.");
      return;
    } */

    await axios.post("/api/musician/setup", {
      clerkUserId: user.id,
      ...form,
      mediaUrls: [],
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <Music className="h-7 w-7 text-blue-600 mr-2" />
          <span className="font-bold text-lg text-gray-900">MusiConnect</span>
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">
          Complete Your Musician Profile
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Tell us more about your music so we can connect you with the right
          audience.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Your  name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block font-medium mb-1">Genres</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                placeholder="Add a genre"
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag("genres", genreInput)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.genres.map((genre, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag("genres", i)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Instruments</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={instrumentInput}
                onChange={(e) => setInstrumentInput(e.target.value)}
                placeholder="Add an instrument"
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag("instruments", instrumentInput)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.instruments.map((inst, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {inst}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag("instruments", i)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Services</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                placeholder="Add a service (e.g. Songwriting)"
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag("services", serviceInput)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.services.map((srv, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {srv}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag("services", i)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <input
            type="text"
            name="location"
            placeholder="Your location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="bio"
            placeholder="Tell us about yourself"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            required
            className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block font-medium mb-2">Cover Image</label>
            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Upload Cover Image
            </button>
            {form.coverImage && (
              <div className="relative w-full h-52 mt-3 rounded-lg overflow-hidden">
                <Image
                  src={form.coverImage}
                  alt="Cover"
                  fill
                  className="object-cover rounded-lg"
                  sizes="100vw"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
