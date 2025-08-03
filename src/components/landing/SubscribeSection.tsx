"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");

    setLoading(true);
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.status === 200) {
      toast.success("Subscribed successfully!");
      setEmail("");
    } else if (res.status === 409) {
      toast.error("You are already subscribed!");
    } else {
      toast.error("Subscription failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <section className="py-12 bg-white text-center">
      <h2 className="text-xl font-bold mb-2">MusiConnect</h2>
      <p className="mb-6 text-gray-600">Stay up to date with new artists!</p>

      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-2 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </section>
  );
}
