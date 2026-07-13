import { z } from "zod";

const timeStringSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");

export const setAvailabilitySchema = z.object({
  body: z.object({
    regularHours: z.array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6), // 0 = Sunday, 6 = Saturday
        isAvailable: z.boolean(),
        slots: z.array(
          z.object({
            startTime: timeStringSchema,
            endTime: timeStringSchema,
          })
        ).optional(), // Optional if isAvailable is false
      })
    ).length(7, "Must provide exactly 7 days of the week"),
    
    // Optional date-specific exceptions (e.g., holidays)
    exceptions: z.array(
      z.object({
        date: z.string().date("Invalid date format (YYYY-MM-DD)"),
        isAvailable: z.boolean(),
        slots: z.array(
          z.object({
            startTime: timeStringSchema,
            endTime: timeStringSchema,
          })
        ).optional(),
      })
    ).optional(),
  }),
});

export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>["body"];
