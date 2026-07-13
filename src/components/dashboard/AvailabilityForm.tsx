"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Clock, Check, AlertCircle } from "lucide-react";
import { availabilityApi } from "@/lib/availability";
import type { DayAvailability, TimeSlot } from "@/lib/availability";

interface AvailabilityFormProps {
  initialData?: any;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_HOURS: DayAvailability[] = DAYS.map((_, i) => ({
  dayOfWeek: i,
  isAvailable: i > 0 && i < 6, // Mon-Fri default available
  slots: [{ startTime: "09:00", endTime: "17:00" }],
}));

export function AvailabilityForm({ initialData }: AvailabilityFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [regularHours, setRegularHours] = useState<DayAvailability[]>(
    initialData?.regularHours?.length === 7 ? initialData.regularHours : DEFAULT_HOURS
  );

  const toggleDay = (dayIndex: number) => {
    setRegularHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex ? { ...day, isAvailable: !day.isAvailable } : day
      )
    );
  };

  const addSlot = (dayIndex: number) => {
    setRegularHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, slots: [...day.slots, { startTime: "09:00", endTime: "17:00" }] }
          : day
      )
    );
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setRegularHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, slots: day.slots.filter((_, idx) => idx !== slotIndex) }
          : day
      )
    );
  };

  const updateSlot = (dayIndex: number, slotIndex: number, field: keyof TimeSlot, value: string) => {
    setRegularHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              slots: day.slots.map((s, idx) => (idx === slotIndex ? { ...s, [field]: value } : s)),
            }
          : day
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate that available days have at least one slot
      for (const day of regularHours) {
        if (day.isAvailable && day.slots.length === 0) {
          throw new Error(`${DAYS[day.dayOfWeek]} is marked available but has no time slots.`);
        }
        if (day.isAvailable) {
          for (const slot of day.slots) {
            if (slot.startTime >= slot.endTime) {
              throw new Error(`Invalid time range on ${DAYS[day.dayOfWeek]}: ${slot.startTime} to ${slot.endTime}. Start time must be before end time.`);
            }
          }
        }
      }

      await availabilityApi.upsertAvailability({
        regularHours,
        exceptions: [], // Future: Support exceptions
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ padding: "2rem", borderBottom: "1px solid var(--border)", background: "var(--gray-50)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Clock size={20} color="var(--orange)" /> Regular Weekly Hours
        </h2>
        <p style={{ color: "var(--gray-500)", margin: 0, fontSize: "0.95rem" }}>
          Set your recurring availability for a typical week. You can add multiple shifts (e.g. 09:00 - 12:00, 13:00 - 17:00).
        </p>
      </div>

      <div style={{ padding: "0" }}>
        {regularHours.map((day, dayIndex) => (
          <div key={day.dayOfWeek} style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "2rem", padding: "1.5rem 2rem", borderBottom: dayIndex < 6 ? "1px solid var(--border)" : "none" }}>
            
            {/* Day Toggle */}
            <div style={{ width: "160px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => toggleDay(dayIndex)}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  background: day.isAvailable ? "var(--orange)" : "var(--gray-300)",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: "2px",
                  left: day.isAvailable ? "22px" : "2px",
                  transition: "left 0.2s, box-shadow 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }} />
              </button>
              <span style={{ fontWeight: 600, color: day.isAvailable ? "var(--gray-900)" : "var(--gray-400)", fontSize: "1.05rem" }}>
                {DAYS[day.dayOfWeek]}
              </span>
            </div>

            {/* Slots */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              {!day.isAvailable ? (
                <span style={{ color: "var(--gray-400)", fontStyle: "italic", display: "inline-block", padding: "0.25rem 0" }}>Unavailable</span>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <input
                        type="time"
                        required
                        value={slot.startTime}
                        onChange={(e) => updateSlot(dayIndex, slotIndex, "startTime", e.target.value)}
                        style={{ padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "inherit", outline: "none", fontSize: "0.95rem" }}
                      />
                      <span style={{ color: "var(--gray-400)" }}>to</span>
                      <input
                        type="time"
                        required
                        value={slot.endTime}
                        onChange={(e) => updateSlot(dayIndex, slotIndex, "endTime", e.target.value)}
                        style={{ padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "inherit", outline: "none", fontSize: "0.95rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeSlot(dayIndex, slotIndex)}
                        style={{ background: "none", border: "none", color: "var(--gray-400)", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Remove shift"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => addSlot(dayIndex)}
                      style={{ background: "none", border: "none", color: "var(--orange)", fontWeight: 600, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", cursor: "pointer", padding: 0 }}
                    >
                      <Plus size={16} /> Add Shift
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "2rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {error && (
          <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "1rem", borderRadius: "8px", border: "1px solid #FECACA", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#F0FDF4", color: "#16A34A", padding: "1rem", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Check size={18} /> Availability updated successfully!
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" loading={loading} style={{ minWidth: "160px" }}>
            Save Availability
          </Button>
        </div>
      </div>
    </form>
  );
}
