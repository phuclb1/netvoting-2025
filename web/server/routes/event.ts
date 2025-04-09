import { authedProcedure, router } from "../trpc";
import { ky } from "@/protocol";
import { paginationSchema } from "@/lib/schemas/params";
import { ApiList } from "@/lib/types";
import {
  Event,
  eventCreateSchema,
  eventSchema,
  eventUpdateSchema,
} from "@/lib/schemas/event";
import { z } from "zod";

export const eventRouter = router({
  list: authedProcedure
    .input(paginationSchema)
    // .query(async ({ input }) => {
      .query(async () => 
      // const { page_size: page_size, page: page, query } = input;
      // return ky.get<ApiList<Event, "events">>({
      //   url: "/events",
      //   params: { page_size, page, query },
      // });
       ({
        total: 2,
        has_next: false,
        current_page: 1,
        events: [
          {id: "1", title: "Event 1", event_time: new Date(), image: "Description 1", created_at: new Date(), updated_at: new Date()},
          {id: "2", title: "Event 2", event_time: new Date(), image: "Description 1", created_at: new Date(), updated_at: new Date()},
        ]
      } as ApiList<Event, "events">)
    ),
  detail: authedProcedure
    .input(eventSchema.pick({ id: true }))
    .query(async ({ input }) => ky.get<Event>(`/events/${input.id}`)),
  create: authedProcedure
    .input(eventCreateSchema)
    .mutation(async ({ input }) => ky.post<Event>("/events", input)),
  delete: authedProcedure
    .input(z.object({ ids: eventSchema.shape.id.array() }))
    .mutation(async ({ input }) =>
      ky.delete({ url: "/events", params: { ids: input.ids } })
    ),
  update: authedProcedure
    .input(eventUpdateSchema)
    .mutation(async ({ input }) => ky.put<Event>(`/events/${input.id}`, input)),
});
