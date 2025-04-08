import { z } from "zod";
import { userSchema } from "./user";

export const centerTypeEnum = z.enum(["Football", "Basketball"]);
export type CenterType = z.TypeOf<typeof centerTypeEnum>;

export const centerDepartmentEnum = z.enum(["Affiliated", "Cooperate"]);
export type CenterDepartment = z.TypeOf<typeof centerDepartmentEnum>;

export const trainingCenterSchema = z.object({
  id: z.string(),
  manager_id: z.string(),
  name: z.string().min(1, { message: "Name must be required" }),
  address: z.string().min(1, { message: "Address must be required " }),
  type: z.string(),
  department: z.string(),
  manager: userSchema,
  created_at: z.number(),
  updated_at: z.number(),
});

export type TrainingCenter = z.TypeOf<typeof trainingCenterSchema>;

export const centerCreateSchema = trainingCenterSchema.pick({
  manager_id: true,
  name: true,
  address: true,
  type: true,
  department: true,
});

export type CenterCreate = z.TypeOf<typeof centerCreateSchema>;

export const centerUpdateSchema = trainingCenterSchema.pick({
  id: true,
  manager_id: true,
  name: true,
  address: true,
  type: true,
  department: true,
});

export type CenterUpdate = z.TypeOf<typeof centerUpdateSchema>;
