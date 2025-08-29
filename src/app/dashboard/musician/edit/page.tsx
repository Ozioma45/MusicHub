"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";
import Image from "next/image";

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

export default function EditMusicianProfilePage() {
  const [loading, setLoading] = useState(true);
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
          imageUrl: data.imageUrl || "",
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

  // Generic input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // Array fields
  const handleArrayChange = (
    field: "genres" | "instruments" | "services",
    index: number,
    value: string
  ) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addArrayField = (field: "genres" | "instruments" | "services") =>
    setForm({ ...form, [field]: [...form[field], ""] });

  const removeArrayField = (
    field: "genres" | "instruments" | "services",
    index: number
  ) => setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <Button type="button" onClick={() => addArrayField("genres")}>
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
            <Button type="button" onClick={() => addArrayField("instruments")}>
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
            <Button type="button" onClick={() => addArrayField("services")}>
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
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
