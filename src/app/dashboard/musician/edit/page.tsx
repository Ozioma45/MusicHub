"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";
import Image from "next/image";

interface CloudinaryFile {
  uploadInfo: { secure_url: string };
}
interface CloudinaryResult {
  info?: { files?: CloudinaryFile[] };
}

export default function EditMusicianProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    genres: [] as string[],
    instruments: [] as string[],
    services: [] as string[],
    location: "",
    bio: "",
    coverImage: "",
    mediaUrls: [] as string[],
  });

  const router = useRouter();

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/musician/profile");
        if (!res.ok) throw new Error();
        const data = await res.json();

        setForm({
          name: data.name || "",
          genres: data.genres || [],
          instruments: data.instruments || [],
          services: data.services || [],
          location: data.location || "",
          bio: data.bio || "",
          coverImage: data.coverImage || "",
          mediaUrls: data.mediaUrls || [],
        });
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle multiple array field changes
  const handleArrayChange = (
    field: "genres" | "instruments" | "services",
    index: number,
    value: string
  ) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addArrayField = (field: "genres" | "instruments" | "services") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayField = (
    field: "genres" | "instruments" | "services",
    index: number
  ) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  // Image upload
  const handleImageUpload = () => {
    // @ts-expect-error cloudinary global
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "musiconnect",
        sources: ["local", "url", "camera"],
        cropping: true,
        multiple: false,
        folder: "musicians",
      },
      (error: unknown, result: unknown) => {
        if (
          !error &&
          typeof result === "object" &&
          result &&
          "event" in result &&
          (result as { event: string }).event === "success"
        ) {
          const url = (result as { info?: { secure_url?: string } }).info
            ?.secure_url;
          if (url) {
            setForm({ ...form, coverImage: url });
            toast.success("Cover image uploaded!");
          }
        }
      }
    );
  };

  // Video upload
  const handleVideoUpload = () => {
    // @ts-expect-error cloudinary global
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "musiconnect_videos",
        sources: ["local", "camera"],
        resourceType: "video",
        multiple: true,
        folder: "musicians/videos",
        maxFileSize: 30 * 1024 * 1024,
        maxVideoDuration: 60,
      },
      (error: unknown, result: CloudinaryResult) => {
        if (!error && Array.isArray(result.info?.files)) {
          const uploadedUrls = result.info.files.map(
            (file) => file.uploadInfo.secure_url
          );
          setForm((prev) => ({
            ...prev,
            mediaUrls: [...prev.mediaUrls, ...uploadedUrls],
          }));
          toast.success(`${uploadedUrls.length} video(s) uploaded!`);
        }
      }
    );
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.bio.trim().length < 20) {
      toast.error("Your bio must be at least 20 characters long.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/musician/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      toast.success("Profile updated!");
      router.push("/dashboard/musician/profile");
    } catch {
      toast.error("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-20 text-gray-500">
          Loading profile...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          ✏️ Edit Musician Profile
        </h1>
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
              onChange={handleChange}
            />
          </div>

          {/* Genres */}
          <div>
            <label className="block font-semibold mb-1">Genres</label>
            {form.genres.map((genre, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  value={genre}
                  onChange={(e) =>
                    handleArrayChange("genres", idx, e.target.value)
                  }
                  placeholder="e.g., Jazz"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeArrayField("genres", idx)}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addArrayField("genres")}
              className="bg-blue-600 hover:bg-blue-800 text-white"
            >
              + Add Genre
            </Button>
          </div>

          {/* Instruments */}
          <div>
            <label className="block font-semibold mb-1">Instruments</label>
            {form.instruments.map((instrument, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  value={instrument}
                  onChange={(e) =>
                    handleArrayChange("instruments", idx, e.target.value)
                  }
                  placeholder="e.g., Guitar"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeArrayField("instruments", idx)}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addArrayField("instruments")}
              className="bg-blue-600 hover:bg-blue-800 text-white"
            >
              + Add Instrument
            </Button>
          </div>

          {/* Services */}
          <div>
            <label className="block font-semibold mb-1">Services</label>
            {form.services.map((service, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  value={service}
                  onChange={(e) =>
                    handleArrayChange("services", idx, e.target.value)
                  }
                  placeholder="e.g., Live Performance"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeArrayField("services", idx)}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addArrayField("services")}
              className="bg-blue-600 hover:bg-blue-800 text-white"
            >
              + Add Service
            </Button>
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold mb-1">Location</label>
            <Input
              name="location"
              placeholder="City, Country"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-semibold mb-1">Bio</label>
            <Textarea
              name="bio"
              placeholder="Tell us about yourself"
              value={form.bio}
              onChange={handleChange}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block font-semibold mb-2">Cover Image</label>
            <Button
              type="button"
              variant="outline"
              onClick={handleImageUpload}
              className="w-full"
            >
              Upload Cover Image
            </Button>
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
            <Button
              type="button"
              variant="outline"
              onClick={handleVideoUpload}
              className="w-full"
            >
              Upload Videos
            </Button>
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
            className="w-full bg-blue-600 hover:bg-blue-800 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
