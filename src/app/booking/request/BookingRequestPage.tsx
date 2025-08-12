"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";
import SubscribeSection from "@/components/landing/SubscribeSection";

export default function BookingRequestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const musicianId = searchParams.get("musicianId");

  const [form, setForm] = useState({
    eventType: "",
    date: "",
    location: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          musicianId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error || "Booking failed. Please try again.";
        toast.error(errMsg);
        setError(errMsg);
        return;
      }

      toast.success("Booking Request Sent successfully");
      router.push("/dashboard?success=1");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send booking request.");
      setError("Failed to send booking request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Request a Booking
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
            Fill out the form below to send a booking request directly to the
            musician.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="eventType" className="font-medium">
              Event Type
            </Label>
            <Input
              name="eventType"
              placeholder="Wedding, Birthday, Corporate Event..."
              value={form.eventType}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="date" className="font-medium">
              Date
            </Label>
            <Input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location" className="font-medium">
              Location
            </Label>
            <Input
              name="location"
              placeholder="Event Venue or Address"
              value={form.location}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message" className="font-medium">
              Message
            </Label>
            <Textarea
              name="message"
              placeholder="Add details, expectations, or questions..."
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 cursor-pointer"
          >
            {loading ? "Sending..." : "Submit Booking Request"}
          </Button>
        </form>
      </div>

      <SubscribeSection />
    </MainLayout>
  );
}
