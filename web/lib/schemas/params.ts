import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().default(1),
  page_size: z.number().default(15),
  query: z.string().optional(),
});
