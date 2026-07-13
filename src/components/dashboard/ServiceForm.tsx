"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { CreateServiceInput } from "@/schemas/service.schema";

import { servicesApi } from "@/lib/services";

interface ServiceFormProps {
  initialData?: any;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes?.toString() || "");
  const [imageUrl, setImageUrl] = useState(initialData?.images?.[0] || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CreateServiceInput = {
        title,
        description,
        categoryId,
        price: parseFloat(price),
        durationMinutes: parseInt(durationMinutes, 10),
        images: imageUrl ? [imageUrl] : [],
        isAvailable: isActive,
      };

      if (initialData) {
        await servicesApi.update(initialData._id, payload);
      } else {
        await servicesApi.create(payload);
      }

      router.push("/dashboard/services");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", padding: "2.5rem" }}>
      {error && (
        <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "1rem", borderRadius: "8px", marginBottom: "2rem", border: "1px solid #FECACA", fontSize: "0.95rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: "var(--gray-900)", marginBottom: "0.5rem" }}>Service Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Premium Home Deep Cleaning"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "1rem", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "var(--orange)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: "var(--gray-900)", marginBottom: "0.5rem" }}>Description *</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what is included in this service..."
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "1rem", outline: "none", resize: "vertical" }}
            onFocus={(e) => e.target.style.borderColor = "var(--orange)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: "var(--gray-900)", marginBottom: "0.5rem" }}>Category *</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "1rem", outline: "none", background: "var(--white)" }}
            onFocus={(e) => e.target.style.borderColor = "var(--orange)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          >
            <option value="" disabled>Select a category</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Moving">Moving</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: "var(--gray-900)", marginBottom: "0.5rem" }}>Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "1rem", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "var(--orange)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", margin: "0.3rem 0 0" }}>Temporary: Paste a direct link to an image.</p>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: "var(--gray-900)", marginBottom: "0.5rem" }}>Price ($) *</label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="99.99"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "1rem", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "var(--orange)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: "var(--gray-900)", marginBottom: "0.5rem" }}>Duration (Minutes) *</label>
          <input
            type="number"
            required
            min="1"
            step="1"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="120"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "1rem", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "var(--orange)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "var(--orange)" }}
          />
          <label htmlFor="isActive" style={{ fontSize: "1rem", color: "var(--gray-900)", fontWeight: 500, cursor: "pointer" }}>
            Service is active and available for booking
          </label>
        </div>
      </div>

      <div style={{ marginTop: "3rem", borderTop: "1px solid var(--border)", paddingTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button variant="secondary" type="button" onClick={() => router.push("/dashboard/services")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Save Changes" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
