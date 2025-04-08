import { authedProcedure, router } from "../trpc";
import { ky } from "@/protocol";
import { paginationSchema } from "@/lib/schemas/params";
import { ApiList } from "@/lib/types";
import { User } from "next-auth";
import {
  updatePasswordSchema,
  userCreateSchema,
  userSchema,
  userUpdateSchema,
} from "@/lib/schemas/user";
import { z } from "zod";

export const userRouter = router({
  list: authedProcedure
    .input(paginationSchema.extend({ roles: z.array(z.string()).optional() }))
    .query(async ({ input }) => {
      const { page_size: page_size, page: page, query, roles } = input;
      return ky.get<ApiList<User, "users">>({
        url: "/users",
        params: { page_size, page, query, roles },
      });
    }),
  detail: authedProcedure
    .input(userSchema.pick({ id: true }))
    .query(async ({ input }) => ky.get<User>(`/users/${input.id}`)),
  create: authedProcedure
    .input(userCreateSchema)
    .mutation(async ({ input }) => ky.post<User>("/users", input)),
  delete: authedProcedure
    .input(z.object({ ids: userSchema.shape.id.array() }))
    .mutation(async ({ input }) =>
      ky.delete({ url: "/users", params: { ids: input.ids } })
    ),
  update: authedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ input }) => ky.put<User>(`/users/${input.id}`, input)),
  update_password: authedProcedure
    .input(updatePasswordSchema)
    .mutation(async ({ input }) => ky.put<User>(`/users/${input.id}`, input)),
});
