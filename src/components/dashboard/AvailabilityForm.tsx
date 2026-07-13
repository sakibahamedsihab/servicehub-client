"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Clock, Check, AlertCircle, Copy, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { availabilityApi } from "@/lib/availability";
import type { DayAvailability, TimeSlot } from "@/lib/availability";

interface AvailabilityFormProps {
  vendorId: string;
  initialData?: any;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_HOURS: DayAvailability[] = DAYS.map((_, i) => ({
  dayOfWeek: i,
  isAvailable: i > 0 && i < 6, // Mon-Fri default available
  slots: [{ startTime: "09:00", endTime: "17:00" }],
}));

export function AvailabilityForm({ vendorId, initialData }: AvailabilityFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Monday expanded by default

  const [regularHours, setRegularHours] = useState<DayAvailability[]>(
    initialData?.regularHours?.length === 7 ? initialData.regularHours : DEFAULT_HOURS
  );

  const toggleDay = (dayIndex: number) => {
    setRegularHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex ? { ...day, isAvailable: !day.isAvailable } : day
      )
    );
    if (expandedDay !== dayIndex) {
      setExpandedDay(dayIndex);
    }
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

  const copyToAllWeekdays = (sourceDayIndex: number) => {
    const sourceSlots = regularHours[sourceDayIndex].slots;
    const isAvail = regularHours[sourceDayIndex].isAvailable;

    setRegularHours((prev) =>
      prev.map((day, i) => {
        // Apply to Monday (1) through Friday (5)
        if (i >= 1 && i <= 5 && i !== sourceDayIndex) {
          return { ...day, isAvailable: isAvail, slots: JSON.parse(JSON.stringify(sourceSlots)) };
        }
        return day;
      })
    );
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const resetDefaults = () => {
    if (window.confirm("Are you sure you want to reset to default hours (Mon-Fri 9-5)?")) {
      setRegularHours(JSON.parse(JSON.stringify(DEFAULT_HOURS)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
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

      await availabilityApi.upsertAvailability(vendorId, {
        regularHours,
        exceptions: [],
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
      <div style={{ padding: "2rem", borderBottom: "1px solid var(--border)", background: "var(--gray-50)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={20} color="var(--orange)" /> Regular Weekly Hours
          </h2>
          <p style={{ color: "var(--gray-500)", margin: 0, fontSize: "0.95rem" }}>
            Set your recurring availability for a typical week.
          </p>
        </div>
        <button
          type="button"
          onClick={resetDefaults}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--white)", border: "1px solid var(--border)", padding: "0.5rem 1rem", borderRadius: "8px", color: "var(--gray-600)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s" }}
        >
          <RefreshCw size={14} /> Reset Defaults
        </button>
      </div>

      <div style={{ padding: "0" }}>
        {regularHours.map((day, dayIndex) => {
          const isExpanded = expandedDay === dayIndex;
          return (
            <div key={day.dayOfWeek} style={{ borderBottom: dayIndex < 6 ? "1px solid var(--border)" : "none", transition: "background 0.2s", background: isExpanded ? "var(--white)" : "transparent" }}>
              {/* Day Header (Always visible) */}
              <div 
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2rem", cursor: "pointer" }}
                onClick={() => setExpandedDay(isExpanded ? null : dayIndex)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleDay(dayIndex); }}
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
                  <span style={{ fontWeight: 600, color: day.isAvailable ? "var(--gray-900)" : "var(--gray-400)", fontSize: "1.05rem", width: "100px" }}>
                    {DAYS[day.dayOfWeek]}
                  </span>
                  {!isExpanded && day.isAvailable && day.slots.length > 0 && (
                    <span style={{ color: "var(--gray-500)", fontSize: "0.85rem", background: "var(--gray-50)", padding: "0.25rem 0.75rem", borderRadius: "100px", border: "1px solid var(--border)" }}>
                      {day.slots[0].startTime} - {day.slots[0].endTime} {day.slots.length > 1 && `(+${day.slots.length - 1} more)`}
                    </span>
                  )}
                  {!isExpanded && !day.isAvailable && (
                    <span style={{ color: "var(--gray-400)", fontSize: "0.85rem", fontStyle: "italic" }}>Unavailable</span>
                  )}
                </div>
                
                <div style={{ color: "var(--gray-400)" }}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded Content (Slots) */}
              {isExpanded && (
                <div style={{ padding: "0 2rem 1.5rem 5rem" }}>
                  {!day.isAvailable ? (
                    <p style={{ color: "var(--gray-500)", margin: 0, fontSize: "0.95rem" }}>You are not available for bookings on this day.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {day.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <input
                            type="time"
                            required
                            value={slot.startTime}
                            onChange={(e) => updateSlot(dayIndex, slotIndex, "startTime", e.target.value)}
                            style={{ padding: "0.5rem 0.75rem", border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "inherit", outline: "none", fontSize: "0.95rem", width: "130px", background: "var(--gray-50)" }}
                          />
                          <span style={{ color: "var(--gray-400)", fontSize: "0.9rem", fontWeight: 500 }}>to</span>
                          <input
                            type="time"
                            required
                            value={slot.endTime}
                            onChange={(e) => updateSlot(dayIndex, slotIndex, "endTime", e.target.value)}
                            style={{ padding: "0.5rem 0.75rem", border: "1px solid var(--border)", borderRadius: "6px", fontFamily: "inherit", outline: "none", fontSize: "0.95rem", width: "130px", background: "var(--gray-50)" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(dayIndex, slotIndex)}
                            style={{ background: "none", border: "none", color: "var(--gray-400)", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s" }}
                            title="Remove shift"
                            onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "var(--gray-400)"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => addSlot(dayIndex)}
                          style={{ background: "none", border: "none", color: "var(--gray-900)", fontWeight: 600, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", padding: 0 }}
                        >
                          <Plus size={16} /> Add Another Shift
                        </button>
                        
                        {/* Copy to all weekdays button (only show on Mon-Fri) */}
                        {dayIndex >= 1 && dayIndex <= 5 && day.slots.length > 0 && (
                          <button
                            type="button"
                            onClick={() => copyToAllWeekdays(dayIndex)}
                            style={{ background: "none", border: "none", color: "var(--orange)", fontWeight: 600, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", padding: 0 }}
                          >
                            <Copy size={14} /> Copy to all weekdays
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "2rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem", background: "var(--gray-50)" }}>
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
