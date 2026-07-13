import { z } from "zod";

export const createVendorProfileSchema = z.object({
  body: z.object({
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description too long"),
    categories: z.array(z.string()).min(1, "Select at least one category"),
    contactPhone: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().min(2, "City is required"),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().min(2, "Country is required"),
    }).optional(),
    avatarUrl: z.string().url("Invalid URL").optional(),
  }),
});

export const updateVendorProfileSchema = z.object({
  body: createVendorProfileSchema.shape.body.partial(),
});

export type CreateVendorProfileInput = z.infer<typeof createVendorProfileSchema>["body"];
export type UpdateVendorProfileInput = z.infer<typeof updateVendorProfileSchema>["body"];
