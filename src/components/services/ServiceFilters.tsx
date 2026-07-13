"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "../ui/Button";

const CATEGORIES = [
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Appliance Repair",
  "Pest Control",
  "Moving",
];

const SORTS = [
  { value: "createdAt", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort]     = useState(searchParams.get("sort") || "createdAt");

  const handleApply = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort)     params.set("sort", sort);

    startTransition(() => {
      router.push(`/services?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("createdAt");
    startTransition(() => {
      router.push("/services");
    });
  };

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: "2rem", opacity: isPending ? 0.7 : 1, transition: "opacity 0.2s" }}>
      {/* Category */}
      <div>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-900)", marginBottom: "1rem" }}>
          Category
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.95rem", cursor: "pointer" }}>
            <input
              type="radio"
              name="category"
              value=""
              checked={category === ""}
              onChange={(e) => setCategory(e.target.value)}
              style={{ accentColor: "var(--orange)", width: "16px", height: "16px" }}
            />
            All Categories
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.95rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={(e) => setCategory(e.target.value)}
                style={{ accentColor: "var(--orange)", width: "16px", height: "16px" }}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-900)", marginBottom: "1rem" }}>
          Price Range ($)
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border)", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--orange)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <span style={{ color: "var(--gray-500)" }}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border)", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--orange)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      {/* Sort */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-900)", marginBottom: "1rem" }}>
          Sort By
        </h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ width: "100%", padding: "0.6rem", border: "1px solid var(--border)", fontSize: "0.9rem", outline: "none", background: "var(--white)", cursor: "pointer" }}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
        <Button onClick={handleApply} disabled={isPending} fullWidth>
          {isPending ? "Applying..." : "Apply Filters"}
        </Button>
        <Button variant="secondary" onClick={handleClear} disabled={isPending} fullWidth>
          Clear All
        </Button>
      </div>
    </aside>
  );
}
