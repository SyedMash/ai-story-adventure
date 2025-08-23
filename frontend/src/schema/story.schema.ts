import * as z from "zod";

export const storySchema = z.object({
  country: z.string().min(1, { message: "country is required" }),
  city: z.string().min(1, { message: "city is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
});
