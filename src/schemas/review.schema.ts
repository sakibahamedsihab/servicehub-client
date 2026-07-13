import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
    rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
    comment: z.string().max(1000, "Comment is too long").optional(),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
