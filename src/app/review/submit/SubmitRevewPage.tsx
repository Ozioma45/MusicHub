"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import MainLayout from "@/components/MainLayout";
import { Star } from "lucide-react";
import clsx from "clsx";

export default function SubmitReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const musicianId = searchParams.get("musicianId");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ musicianId, rating, comment }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Review failed");

      toast.success("Review Added Successfully 🎉");
      router.push("/explore?review=success");
    } catch (err) {
      toast.error("Failed to submit review ❌");
      setError("Failed to submit review.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-xl shadow-lg bg-white dark:bg-neutral-900">
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-6">
          Leave a Review
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div className="text-center">
            <Label className="block mb-2 font-medium">Your Rating</Label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className={clsx(
                    "w-8 h-8 cursor-pointer transition-colors duration-200",
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us how it went..."
              rows={5}
              className="mt-1"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-medium"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
