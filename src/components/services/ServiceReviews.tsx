"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { reviewsApi, type Review } from "@/lib/reviews";

export function ServiceReviews({ serviceId }: { serviceId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    reviewsApi.getServiceReviews(serviceId, { limit: 10 })
      .then((res) => {
        setReviews(res.reviews);
      })
      .catch(() => {
        setError("Failed to load reviews.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serviceId]);

  if (loading) {
    return <div style={{ padding: "2rem", color: "var(--gray-500)", textAlign: "center" }}>Loading reviews...</div>;
  }

  if (error) {
    return <div style={{ padding: "2rem", color: "#DC2626", textAlign: "center" }}>{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "1rem" }}>Customer Reviews</h2>
        <p style={{ color: "var(--gray-500)", margin: 0 }}>This service doesn't have any reviews yet. Be the first to book and review!</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "2rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "1.5rem" }}>Customer Reviews</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {reviews.map((review) => (
          <div key={review._id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--gray-600)" }}>
                C
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>Verified Customer</div>
                <div style={{ fontSize: "0.85rem", color: "var(--gray-500)" }}>{format(new Date(review.createdAt), "MMMM d, yyyy")}</div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= review.rating ? "#F59E0B" : "none"}
                  color={star <= review.rating ? "#F59E0B" : "var(--gray-300)"}
                />
              ))}
            </div>
            
            {review.comment ? (
              <p style={{ margin: 0, color: "var(--gray-700)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                {review.comment}
              </p>
            ) : (
              <p style={{ margin: 0, color: "var(--gray-400)", fontStyle: "italic", fontSize: "0.95rem" }}>
                No written feedback provided.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
