"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";

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

      if (!res.ok) {
        toast.error("Booking Failed. Try again");
        throw new Error("Booking failed");
      }

      toast.success("Booking Request Sent successfully");
      router.push("/dashboard?success=1");
    } catch (err) {
      toast.error("Failed to send booking request.");
      setError("Failed to send booking request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Request a Booking</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="eventType">Event Type</Label>
            <Input
              name="eventType"
              placeholder="Wedding, Birthday, etc."
              value={form.eventType}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              name="location"
              placeholder="Event Venue"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              name="message"
              placeholder="Add details, expectations, or questions"
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Submit Request"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
