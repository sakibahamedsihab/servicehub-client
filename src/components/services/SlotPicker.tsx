"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { servicesApi, type ServiceSlots } from "@/lib/services";
import { bookingsApi } from "@/lib/bookings";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/Button";

interface SlotPickerProps {
  serviceId: string;
  vendorId: string;
}

export function SlotPicker({ serviceId, vendorId }: SlotPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  
  const [slotsData, setSlotsData] = useState<ServiceSlots | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cache slots by date to prevent refetching when toggling dates
  const [cache, setCache] = useState<Record<string, ServiceSlots>>({});

  useEffect(() => {
    let isMounted = true;

    async function fetchSlots() {
      if (cache[selectedDate]) {
        setSlotsData(cache[selectedDate]);
        setSelectedSlot(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await servicesApi.getSlots(serviceId, selectedDate);
        if (isMounted) {
          setSlotsData(data);
          setSelectedSlot(null);
          setCache(prev => ({ ...prev, [selectedDate]: data }));
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch available slots.");
          setSlotsData(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [serviceId, selectedDate, cache]);

  const handleBook = async () => {
    if (!selectedSlot || !slotsData) return;
    
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const slot = slotsData.slots.find(s => s.startTime === selectedSlot);
    if (!slot) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError(null);

    try {
      await bookingsApi.create({
        serviceId,
        vendorId,
        date: selectedDate,
        startTime: slot.startTime,
      });
      setSubmitStatus("success");
    } catch (err: any) {
      setSubmitStatus("error");
      setSubmitError(err.message || "Failed to book appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div style={{ background: "var(--gray-50)", border: "1.5px solid #10B981", padding: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
          Booking Requested!
        </h3>
        <p style={{ color: "var(--gray-700)", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
          Your appointment for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> has been sent to the vendor for confirmation.
        </p>
        <Button onClick={() => router.push("/dashboard/bookings")} fullWidth>
          View My Bookings
        </Button>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--gray-50)", border: "1px solid var(--border)", padding: "1.5rem", marginBottom: "1.5rem" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "1rem" }}>
        Select Date & Time
      </h3>

      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", background: "var(--white)", outline: "none", fontSize: "0.95rem" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--orange)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      <div style={{ minHeight: "120px" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ height: "40px", background: "var(--gray-200)", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ color: "#EF4444", fontSize: "0.85rem", textAlign: "center", padding: "1rem 0" }}>
            {error}
          </div>
        ) : slotsData?.slots && slotsData.slots.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {slotsData.slots.map((slot) => {
              const isSelected = selectedSlot === slot.startTime;
              return (
                <button
                  key={slot.startTime}
                  onClick={() => setSelectedSlot(slot.startTime)}
                  style={{
                    padding: "0.6rem 0",
                    background: isSelected ? "var(--orange)" : "var(--white)",
                    color: isSelected ? "#fff" : "var(--gray-700)",
                    border: `1.5px solid ${isSelected ? "var(--orange)" : "var(--border)"}`,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = "var(--orange)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  {slot.startTime}
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ color: "var(--gray-500)", fontSize: "0.9rem", textAlign: "center", padding: "1.5rem 0" }}>
            No slots available for this date.
          </div>
        )}
      </div>

      <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
        {submitError && (
          <div style={{ color: "#EF4444", fontSize: "0.85rem", textAlign: "center", marginBottom: "1rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem" }}>
            {submitError}
          </div>
        )}
        <Button fullWidth disabled={!selectedSlot || isSubmitting} loading={isSubmitting} onClick={handleBook}>
          Book Appointment
        </Button>
        <p style={{ fontSize: "0.75rem", color: "var(--gray-500)", textAlign: "center", marginTop: "1rem", margin: "1rem 0 0" }}>
          You won't be charged yet
        </p>
      </div>
    </div>
  );
}
