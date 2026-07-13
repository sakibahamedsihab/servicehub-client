import { z } from "zod";

export const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
    description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description too long"),
    categoryId: z.string().min(1, "Category is required"),
    price: z.number().positive("Price must be greater than 0"),
    durationMinutes: z.number().int().positive("Duration must be at least 1 minute"),
    images: z.array(z.string().url("Invalid image URL")).max(5, "Maximum 5 images allowed").optional(),
    isAvailable: z.boolean().default(true).optional(),
  }),
});

export const updateServiceSchema = z.object({
  body: createServiceSchema.shape.body.partial(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>["body"];
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>["body"];
