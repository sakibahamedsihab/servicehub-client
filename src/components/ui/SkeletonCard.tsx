export function SkeletonCard() {
  return (
    <div
      style={{
        background: "var(--gray-100)",
        border:     "1.5px solid var(--border)",
        borderRadius: 0,
        overflow:   "hidden",
      }}
    >
      {/* Image skeleton */}
      <div
        style={{
          height: "180px",
          background: "linear-gradient(90deg, var(--gray-100) 0%, var(--gray-200) 50%, var(--gray-100) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {/* Title */}
        <div style={{ height: "16px", width: "70%", background: "var(--gray-200)", animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%" }} />
        {/* Subtitle */}
        <div style={{ height: "12px", width: "50%", background: "var(--gray-200)", animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%" }} />
        {/* Price row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
          <div style={{ height: "14px", width: "30%", background: "var(--gray-200)", animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%" }} />
          <div style={{ height: "14px", width: "20%", background: "var(--gray-200)", animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%" }} />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "1.25rem",
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
