import { z } from "zod";

const timeStringSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");

export const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.string().min(1, "Service ID is required"),
    vendorId: z.string().min(1, "Vendor ID is required"),
    date: z.string().date("Invalid date format (YYYY-MM-DD)"),
    startTime: timeStringSchema,
    notes: z.string().max(500, "Notes are too long").optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "confirmed", "completed", "cancelled", "rejected"]),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"];
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>["body"];
