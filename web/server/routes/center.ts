import { authedProcedure, router } from "../trpc";
import { ky } from "@/protocol";
import { paginationSchema } from "@/lib/schemas/params";
import { ApiList } from "@/lib/types";
import {
  TrainingCenter,
  centerCreateSchema,
  trainingCenterSchema,
  centerUpdateSchema,
} from "@/lib/schemas/training-center";
import { z } from "zod";

export const centerRouter = router({
  list: authedProcedure.input(paginationSchema).query(async ({ input }) => {
    const { page_size: page_size, page: page, query } = input;
    return ky.get<ApiList<TrainingCenter, "centers">>({
      url: "/training-center",
      params: { page_size, page, query },
    });
  }),
  detail: authedProcedure
    .input(trainingCenterSchema.pick({ id: true }))
    .query(async ({ input }) =>
      ky.get<TrainingCenter>(`/training-center/${input.id}`)
    ),
  create: authedProcedure
    .input(centerCreateSchema)
    .mutation(async ({ input }) =>
      ky.post<TrainingCenter>("/training-center", input)
    ),
  delete: authedProcedure
    .input(z.object({ ids: trainingCenterSchema.shape.id.array() }))
    .mutation(async ({ input }) =>
      ky.delete({ url: "/training-center", params: { ids: input.ids } })
    ),
  update: authedProcedure
    .input(centerUpdateSchema)
    .mutation(async ({ input }) =>
      ky.put<TrainingCenter>(`/training-center/${input.id}`, input)
    ),
});
