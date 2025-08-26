"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";
import Image from "next/image";

export default function EditBookerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    bio: "",
    imageUrl: "",
    coverImage: "",
  });

  const router = useRouter();

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/booker/profile");
        if (!res.ok) throw new Error();
        const data = await res.json();

        setForm({
          name: data.name || "",
          location: data.location || "",
          bio: data.bio || "",
          imageUrl: data.imageUrl || "",
          coverImage: data.coverImage || "",
        });
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle text changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        folder: "bookers",
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
            setForm({ ...form, imageUrl: url });
            toast.success("Profile image uploaded!");
          }
        }
      }
    );
  };

  // Image Cover upload
  const handleCoverUpload = () => {
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

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /*  if (form.bio.trim().length < 20) {
      toast.error("Your bio must be at least 20 characters long.");
      return;
    } */

    setSaving(true);
    try {
      const res = await fetch("/api/booker/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      toast.success("Profile updated!");
      router.push("/dashboard/booker/profile");
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
          ✏️ Edit Booker Profile
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <Input
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
            />
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

          {/* Profile Image */}
          <div>
            <label className="block font-semibold mb-2">Profile Image</label>
            <Button
              type="button"
              variant="outline"
              onClick={handleImageUpload}
              className="w-full cursor-pointer"
            >
              Upload Profile Image
            </Button>
            {form.imageUrl && (
              <Image
                src={form.imageUrl}
                alt="Profile"
                width={800}
                height={400}
                className="mt-3 w-full rounded-lg object-cover"
              />
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block font-semibold mb-2">Cover Image</label>
            <Button
              type="button"
              variant="outline"
              onClick={handleCoverUpload}
              className="w-full cursor-pointer"
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

          {/* Submit */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-800 text-white cursor-pointer"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
