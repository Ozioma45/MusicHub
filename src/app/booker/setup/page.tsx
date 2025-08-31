"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import MainLayout from "@/components/MainLayout";

// Validation schema
const bookerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  imageUrl: z.string().optional(),
  coverImage: z.string().optional(),
});

interface BookerForm {
  name: string;
  location: string;
  bio: string;
  imageUrl: string;
  coverImage: string;
}

export default function SetupBookerPage() {
  const { user } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BookerForm>({
    name: "",
    location: "",
    bio: "",
    imageUrl: "",
    coverImage: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BookerForm, string>>
  >({});

  const handleChange = (field: keyof BookerForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Cloudinary helper
  const uploadToCloudinary = async (
    file: File,
    preset: string
  ): Promise<string | null> => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      const res = await fetch(url, { method: "POST", body: formData });
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
      setForm((prev) => ({ ...prev, imageUrl: url }));
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
      setForm((prev) => ({ ...prev, coverImage: url }));
      toast.success("Cover image uploaded!");
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setErrors({});

    try {
      // Validate form
      const parsed = bookerSchema.parse(form);

      const res = await fetch("/api/booker/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkUserId: user.id, ...parsed }),
      });

      if (!res.ok) throw new Error();
      toast.success("Profile completed!");
      router.push("/dashboard");
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Partial<Record<keyof BookerForm, string>> = {};
        err.errors.forEach((zErr: any) => {
          fieldErrors[zErr.path[0] as keyof BookerForm] = zErr.message;
        });
        setErrors(fieldErrors);
        toast.error(err.errors.map((e: any) => e.message).join(", "));
      } else {
        toast.error("Failed to save profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-10">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <Briefcase className="h-7 w-7 text-green-600 mr-2" />
          <span className="font-bold text-lg text-gray-900">MusiConnect</span>
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">
          Complete Your Booker Profile
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Tell us more about yourself so musicians can connect with you.
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
              placeholder="Your name or agency name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

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

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
