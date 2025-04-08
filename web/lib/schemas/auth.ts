import { z } from "zod";

export const loginPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
});
