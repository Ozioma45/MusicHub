"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Music } from "lucide-react";
import { useState } from "react";
import {
  genreCategories,
  instrumentCategories,
  serviceCategories,
} from "@/lib/categories";
import CategorySelector from "@/components/CategorySelector";
import { musicianSchema, MusicianFormData } from "@/lib/musicianSchema";

type CloudinaryResult = {
  event: string;
  info: { secure_url: string };
};

export default function SetupMusicianPage() {
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState<MusicianFormData>({
    name: "",
    genres: [],
    instruments: [],
    services: [],
    location: "",
    bio: "",
    coverImage: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof MusicianFormData, string>>
  >({});

  const handleChange = (field: keyof MusicianFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* 🔧 Cloudinary Upload */
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
          handleChange("coverImage", result.info.secure_url);
        }
      }
    );
  };

  /* 🔧 Form Submission */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const parsed = musicianSchema.parse(form); // ✅ Validate here
      await axios.post("/api/musician/setup", {
        clerkUserId: user.id,
        ...parsed,
        mediaUrls: [],
      });

      router.push("/dashboard");
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Partial<Record<keyof MusicianFormData, string>> = {};
        err.errors.forEach((zErr: any) => {
          fieldErrors[zErr.path[0] as keyof MusicianFormData] = zErr.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8">
        {/* 🔹 Header */}
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

        {/* 🔹 Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Genres */}
          <CategorySelector
            label="Genres"
            categories={genreCategories}
            values={form.genres}
            setValues={(vals) => handleChange("genres", vals)}
            allowCustom={true}
            placeholder="or Add custom genre"
          />
          {errors.genres && (
            <p className="text-red-500 text-sm">{errors.genres}</p>
          )}

          {/* Instruments */}
          <CategorySelector
            label="Instruments"
            categories={instrumentCategories}
            values={form.instruments}
            setValues={(vals) => handleChange("instruments", vals)}
            allowCustom={true}
            placeholder="Specify other instrument"
          />
          {errors.instruments && (
            <p className="text-red-500 text-sm">{errors.instruments}</p>
          )}

          {/* Services */}
          <CategorySelector
            label="Services"
            categories={serviceCategories}
            values={form.services}
            setValues={(vals) => handleChange("services", vals)}
            allowCustom={true}
            placeholder="Add custom service"
          />
          {errors.services && (
            <p className="text-red-500 text-sm">{errors.services}</p>
          )}

          {/* Location */}
          <div>
            <input
              type="text"
              placeholder="Your location"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <textarea
              placeholder="Tell us about yourself"
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
            />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
          </div>

          {/* Cover Image */}
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
            {errors.coverImage && (
              <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>
            )}
          </div>

          {/* Submit */}
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
