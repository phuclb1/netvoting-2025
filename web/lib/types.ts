import { User } from "next-auth";
import { BaseSyntheticEvent, ReactNode } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface FormProviderProps<T> {
  children: ReactNode;
  defaultValues?: T;
  mode: "CREATE" | "VIEW" | "EDIT";
  users?: User[];
}

export interface FormContextReturn<T extends FieldValues> {
  defaultValues?: T;
  mode: "CREATE" | "VIEW" | "EDIT";
  form: UseFormReturn<T>;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  isPending?: boolean;
  users?: User[];
}

/**
 * 2nd generic parameter is the object key with the data array
 * @example
 * `type Test = ApiList<Tag, 'tags'>`
 * equals to
 * ```
 * {
 * total: number
 * has_next: boolean
 * current_page: number
 * tags: Tag[]
 * }
 * ```
 */
export type ApiList<T, ArrayKey extends string> = {
  total: number;
  has_next: boolean;
  current_page: number;
} & {
  [key in ArrayKey]: T[];
};
