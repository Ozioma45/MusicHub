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
    mediaUrls: "",
  });

  const router = useRouter();

  useEffect(() => {
    // Fetch current musician data
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
        mediaUrls: (data.mediaUrls || []).join(", "),
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
    // @ts-expect-error : Cloudinary is loaded via script tag and lacks type definition
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      mediaUrls: form.mediaUrls.split(",").map((url) => url.trim()),
    };

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

          <Textarea
            name="mediaUrls"
            placeholder="Media URLs (comma-separated)"
            value={form.mediaUrls}
            onChange={handleChange}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
