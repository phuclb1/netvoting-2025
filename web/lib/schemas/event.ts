import { z } from "zod";

export const eventSchema = z.object({
    id: z.string(),
    title: z.string(),
    image: z.string().optional(),
    so_codong: z.number().optional(),
    so_cophieu: z.number().optional(),
    cur_cophieu: z.number().optional(),
    event_time: z.date(),
    created_at: z.date(),
    updated_at: z.date(),
});
export type Event = z.TypeOf<typeof eventSchema>;
export const eventCreateSchema = eventSchema.omit({
    id: true,
    so_codong: true,
    so_cophieu: true,
    cur_cophieu: true,
    created_at: true,
    updated_at: true,
})
export const eventUpdateSchema = eventSchema.pick({
    id: true,
    event_time: true,
    title: true,
    image: true,
}).partial();
export type EventCreate = z.TypeOf<typeof eventCreateSchema>;
export type EventUpdate = z.TypeOf<typeof eventUpdateSchema>;