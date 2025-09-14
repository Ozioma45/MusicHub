"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";
import { musicianSchema } from "@/lib/musicianSchema";
import { Music } from "lucide-react";
import Image from "next/image";
import CategorySelector from "@/components/CategorySelector";
import {
  genreCategories,
  instrumentCategories,
  serviceCategories,
} from "@/lib/categories";
import { ZodError, ZodIssue } from "zod";

interface MusicianForm {
  name: string;
  genres: string[];
  instruments: string[];
  services: string[];
  location: string;
  bio: string;
  coverImage: string;
  imageUrl: string;
  mediaUrls: string[];
}

export default function SetupMusicianPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<MusicianForm>({
    name: "",
    genres: [],
    instruments: [],
    services: [],
    location: "",
    bio: "",
    coverImage: "",
    imageUrl: "",
    mediaUrls: [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof MusicianForm, string>>
  >({});

  const handleChange = <K extends keyof MusicianForm>(
    field: K,
    value: MusicianForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const router = useRouter();

  // Cloudinary silent upload helper
  const uploadToCloudinary = async (
    file: File,
    preset: string,
    resourceType: "image" | "video" = "image"
  ): Promise<string | null> => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
      return null;
    }
  };

  // Profile picture upload
  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.loading("Uploading profile picture...");
    const url = await uploadToCloudinary(file, "musiconnect");
    toast.dismiss();
    if (url) {
      setForm({ ...form, imageUrl: url });
      toast.success("Profile picture uploaded!");
    }
  };

  // Cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.loading("Uploading cover image...");
    const url = await uploadToCloudinary(file, "musiconnect");
    toast.dismiss();
    if (url) {
      setForm({ ...form, coverImage: url });
      toast.success("Cover image uploaded!");
    }
  };

  // Video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    toast.loading("Uploading videos...");
    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadToCloudinary(file, "musiconnect_videos", "video");
      if (url) uploadedUrls.push(url);
    }
    toast.dismiss();
    if (uploadedUrls.length > 0) {
      setForm((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} video(s) uploaded!`);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // ✅ Validate form before sending
      const parsed = musicianSchema.parse(form);

      const res = await fetch("/api/musician/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      toast.success("Profile completed!");
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof MusicianForm, string>> = {};
        err.errors.forEach((zErr: ZodIssue) => {
          fieldErrors[zErr.path[0] as keyof MusicianForm] = zErr.message;
        });
        setErrors(fieldErrors);

        toast.error(err.errors.map((e) => e.message).join(", "));
      } else {
        toast.error("Update failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-10">
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
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <Input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
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
            setValues={(vals) => setForm({ ...form, genres: vals })}
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
            setValues={(vals) => setForm({ ...form, instruments: vals })}
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
            setValues={(vals) => setForm({ ...form, services: vals })}
            allowCustom={true}
            placeholder="Add custom service"
          />
          {errors.services && (
            <p className="text-red-500 text-sm">{errors.services}</p>
          )}

          {/* Location */}
          <div>
            <label className="block font-semibold mb-1">Location</label>
            <Input
              name="location"
              placeholder="City, Country"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block font-semibold mb-1">Bio</label>
            <Textarea
              name="bio"
              placeholder="Tell us about yourself"
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block font-semibold mb-2">Profile Picture</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
            />
            {form.imageUrl && (
              <Image
                src={form.imageUrl}
                alt="Profile Picture"
                width={200}
                height={200}
                className="mt-3 rounded-full object-cover"
              />
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block font-semibold mb-2">Cover Image</label>
            <Input type="file" accept="image/*" onChange={handleCoverUpload} />
            {form.coverImage && (
              <Image
                src={form.coverImage}
                alt="Cover"
                width={800}
                height={400}
                className="mt-3 w-full rounded-lg object-cover"
              />
            )}
          </div>

          {/* Videos */}
          <div>
            <label className="block font-semibold mb-2">
              Performance Videos
            </label>
            <Input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              {form.mediaUrls.map((url, i) => (
                <div key={i} className="relative">
                  <video
                    src={url}
                    controls
                    className="rounded-lg w-full border aspect-video object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        mediaUrls: prev.mediaUrls.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            {saving ? "Saving..." : "Save and Continue"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
