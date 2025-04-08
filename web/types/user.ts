import { z } from "zod";

export const userSchema = z.object({
    name: z.string(),
    id: z.string().optional(),
    email: z.string(),
    password: z.string().optional(),
    role: z.enum(["ADMIN", "USER"]).default("ADMIN")
});


export type User = z.TypeOf<typeof userSchema>;

export const userFormSchema = userSchema;
export type UserCreateUpdate = z.TypeOf<typeof userFormSchema>;

export const userListSchema = z.object({
    total: z.number(),
    users: userSchema.array(),
    has_next: z.boolean(),
    current_page: z.number(),
})

export type UserList = z.TypeOf<typeof userListSchema>;