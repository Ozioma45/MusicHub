// lib/schemas/musicianSchema.ts
import { z } from "zod";

export const bookerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  imageUrl: z.string().optional(),
  coverImage: z.string().optional(),
});

export type BookerFormData = z.infer<typeof bookerSchema>;
