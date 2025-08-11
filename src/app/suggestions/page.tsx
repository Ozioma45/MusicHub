"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MainLayout from "@/components/MainLayout";

export default function SuggestionsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      if (!res.ok) throw new Error("Failed to send suggestion");

      toast.success("Suggestion submitted. Thank you!");
      setTitle("");
      setMessage("");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          Send a Suggestion
        </h1>

        {/* Intro Paragraph */}
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Have an idea or feature you’d love to see? Share your thoughts with
          us, and help improve the platform for everyone.
        </p>

        {/* Suggestion Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Suggestion Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <textarea
            placeholder="Describe your suggestion..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
