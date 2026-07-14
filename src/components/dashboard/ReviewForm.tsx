"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { reviewsApi } from "@/lib/reviews";
import { toast } from "sonner";

interface ReviewFormProps {
  bookingId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({ bookingId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating from 1 to 5 stars.");
      return;
    }

    setLoading(true);
    try {
      await reviewsApi.create({ bookingId, rating, comment });
      toast.success("Review submitted successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "1rem", padding: "1.5rem", background: "var(--gray-50)", borderRadius: "8px", border: "1px solid var(--border)" }}>
      <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "1rem", marginTop: 0 }}>
        Rate your experience
      </h4>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              style={{
                background: "none",
                border: "none",
                padding: "0.25rem",
                cursor: "pointer",
                color: (hoverRating || rating) >= star ? "#F59E0B" : "var(--gray-300)",
                transition: "color 0.2s",
              }}
            >
              <Star fill={(hoverRating || rating) >= star ? "#F59E0B" : "none"} size={32} />
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "0.5rem" }}>
            Add a written review (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you liked or what could be improved..."
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "0.95rem",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
}
