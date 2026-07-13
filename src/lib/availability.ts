import { http } from "./http";
import type { SetAvailabilityInput } from "../schemas/availability.schema";

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DayAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface DateException {
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  slots?: TimeSlot[];
}

export interface Availability {
  _id: string;
  vendorId: string;
  regularHours: DayAvailability[];
  exceptions: DateException[];
  updatedAt: string;
}

export const availabilityApi = {
  /**
   * Get the current vendor's availability configuration.
   */
  getMyAvailability: () => 
    http.get<Availability>("/api/vendors/availability"),

  /**
   * Create or update the current vendor's availability.
   */
  upsertAvailability: (data: SetAvailabilityInput) => 
    http.put<Availability>("/api/vendors/availability", data),
};
