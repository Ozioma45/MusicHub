// lib/schemas/musicianSchema.ts
import { z } from "zod";

export const musicianSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  genres: z.array(z.string()).min(1, "Select at least one genre"),
  instruments: z.array(z.string()).min(1, "Select at least one instrument"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  coverImage: z.string().url("A valid cover image is required"),
});

export type MusicianFormData = z.infer<typeof musicianSchema>;
