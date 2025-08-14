"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Briefcase } from "lucide-react";

type CloudinaryResult = {
  event: string;
  info: { secure_url: string };
};

export default function SetupBookerPage() {
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    location: "",
    bio: "",
    imageUrl: "",
  });

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
        folder: "bookers",
      },
      (error: Error | null, result: CloudinaryResult) => {
        if (!error && result && result.event === "success") {
          setForm((prev) => ({
            ...prev,
            imageUrl: result.info.secure_url,
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

    await axios.post("/api/booker/setup", {
      clerkUserId: user.id,
      ...form,
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Your name or agency name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            name="location"
            placeholder="Your location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <textarea
            name="bio"
            placeholder="Tell us about yourself "
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            required
            className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-green-500"
          />

          <div>
            <label className="block font-medium mb-2">Profile Image</label>
            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Upload Profile Image
            </button>
            {form.imageUrl && (
              <div className="relative w-full h-52 mt-3 rounded-lg overflow-hidden">
                <Image
                  src={form.imageUrl}
                  alt="Profile"
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
