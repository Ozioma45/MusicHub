"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";
import { Music } from "lucide-react";

export default function SelectRolePage() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<
    "MUSICIAN" | "BOOKER" | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!user || !selectedRole) return;
    setLoading(true);

    try {
      await axios.post("/api/user/set-role", {
        role: selectedRole,
        clerkUserId: user.id,
      });

      if (selectedRole === "MUSICIAN") {
        router.push("/musician/setup");
      } else {
        router.push("/booker/setup");
      }
    } catch (err) {
      console.error("Failed to set role:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-8 text-center">
        <div className="flex justify-center items-center mb-6">
          <Music className="h-7 w-7 text-blue-600 mr-2" />
          <span className="font-bold text-lg text-gray-900">MusiConnect</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          How do you want to start?
        </h2>
        <p className="text-gray-500 mb-8">
          Choose a starting role — you can switch anytime later.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            onClick={() => setSelectedRole("MUSICIAN")}
            className={`border rounded-xl p-5 text-left cursor-pointer transition-all ${
              selectedRole === "MUSICIAN"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <h3 className="font-semibold text-gray-900">
              Sign up as a Musician
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Showcase your talent, get booked for gigs, and grow your career.
            </p>
          </div>

          <div
            onClick={() => setSelectedRole("BOOKER")}
            className={`border rounded-xl p-5 text-left cursor-pointer transition-all ${
              selectedRole === "BOOKER"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <h3 className="font-semibold text-gray-900">Sign up as a Booker</h3>
            <p className="text-gray-500 text-sm mt-2">
              Find and hire talented musicians for your events easily.
            </p>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          className={`w-full py-3 rounded-lg font-medium text-white cursor-pointer transition ${
            selectedRole && !loading
              ? "bg-blue-600 hover:bg-blue-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
