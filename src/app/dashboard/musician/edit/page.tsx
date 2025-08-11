"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";
import Image from "next/image";

export default function EditMusicianProfilePage() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    genre: "",
    location: "",
    bio: "",
    coverImage: "",
    mediaUrls: [] as string[],
  });

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/musician/profile");
      if (!res.ok) return toast.error("Failed to load profile.");
      const data = await res.json();

      setForm({
        name: data.name || "",
        genre: data.genre || "",
        location: data.location || "",
        bio: data.bio || "",
        coverImage: data.coverImage || "",
        mediaUrls: data.mediaUrls || [],
      });

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = () => {
    // @ts-expect-error
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

  const handleVideoUpload = () => {
    // @ts-expect-error
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "musiconnect_videos",
        sources: ["local", "camera"],
        resourceType: "video",
        multiple: true,
        folder: "musicians/videos",
        maxFileSize: 30 * 1024 * 1024, // 50 MB limit
        maxVideoDuration: 60, // 60 seconds limit
      },
      (error: unknown, result: unknown) => {
        if (!error && Array.isArray((result as any).info?.files)) {
          const uploadedUrls = (result as any).info.files.map(
            (file: any) => file.uploadInfo.secure_url
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...form };

    const res = await fetch("/api/musician/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Profile updated!");
      router.push("/dashboard/musician/view");
    } else {
      toast.error("Update failed.");
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">✏️ Edit Your Profile</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="genre"
            placeholder="Genre"
            value={form.genre}
            onChange={handleChange}
          />
          <Input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />
          <Textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
          />

          {/* Cover Image Upload */}
          <div>
            <Button type="button" variant="outline" onClick={handleImageUpload}>
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

          {/* Video Upload */}
          <div>
            <Button type="button" variant="outline" onClick={handleVideoUpload}>
              Upload Videos (Max 30MB, 60s each)
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              {form.mediaUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <video
                    src={url}
                    controls
                    className="rounded-lg w-full border aspect-video object-cover"
                  />

                  {/* Delete button overlay */}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        mediaUrls: prev.mediaUrls.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-80 hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
