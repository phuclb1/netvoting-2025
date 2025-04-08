import { z } from "zod";
import { authedProcedure, router } from "../trpc";
import { paginationSchema } from "@/lib/schemas/params";
import { ky } from "@/protocol";

export const exampleRouter = router({
  list: authedProcedure
    .input(
      paginationSchema.extend({
        query: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page_size: page_size, page: page } = input;
      const res = await ky.get<Comment[]>("/comments", {
        prefixUrl: "https://jsonplaceholder.typicode.com",
      });
      return res.slice(page * page_size, (page + 1) * page_size);
    }),
  detail: authedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) =>
      ky.get<Comment>(`/comments/${input.id}`, {
        prefixUrl: "https://jsonplaceholder.typicode.com",
      })
    ),
});
