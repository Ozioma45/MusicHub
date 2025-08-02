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
    coverImage: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = () => {
    // @ts-ignore
    if (!window.cloudinary) {
      console.error("Cloudinary widget is not loaded.");
      return;
    }

    // @ts-ignore
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "unsigned_upload",
        sources: ["local", "url", "camera"],
        cropping: true,
        multiple: false,
        folder: "musicians",
      },
      (error: any, result: any) => {
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

    await axios.post("/api/musician/setup", {
      clerkUserId: user.id,
      ...form,
      mediaUrls: [],
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

        <div>
          <button
            type="button"
            onClick={handleImageUpload}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Upload Cover Image
          </button>
          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="Cover"
              className="mt-2 w-full rounded-lg"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
