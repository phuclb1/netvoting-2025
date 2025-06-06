import { z } from "zod";

export const userRoleEnum = z.enum([
  "ADMIN",
  "SHAREHOLDER",
  "STAFF",
  "GUEST",
]);
export type UserRole = z.TypeOf<typeof userRoleEnum>;

export const userRoles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Cổ đông", value: "SHAREHOLDER" },
  { label: "Khách mời", value: "GUEST" },
];

const baseUserSchema = z.object({
  name: z.string().min(1, { message: "Name must be required" }),
  email: z.string().email(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  role: userRoleEnum,
  id: z.string(),
  hashed_token: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});
export const userSchema = baseUserSchema.extend({
  creator: baseUserSchema,
});

export const userCreateSchema = userSchema
  .pick({
    name: true,
    email: true,
    role: true,
    phone_number: true,
    address: true,
  })
  .extend({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  });
export type UserCreate = z.TypeOf<typeof userCreateSchema>;

export const userUpdateSchema = userSchema
  .pick({
    id: true,
    name: true,
    role: true,
    phone_number: true,
    address: true,
  })
  .extend({
    raw_password: z.string(),
  })
  .partial();
export type UserUpdate = z.TypeOf<typeof userUpdateSchema>;

export const updatePasswordSchema = userSchema
  .pick({
    id: true,
  })
  .extend({
    raw_password: z.string(),
  })
  .partial();

export type UpdatePassword = z.TypeOf<typeof updatePasswordSchema>;
