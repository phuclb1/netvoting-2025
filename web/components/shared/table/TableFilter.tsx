"use client";

import { Input } from "@/components/ui/input";
import atomWithDebounce from "@/lib/atoms/atomWithDebounce";
import { useAtomValue, useSetAtom } from "jotai";
import { ComponentPropsWithRef } from "react";

const { currentValueAtom, debouncedValueAtom } = atomWithDebounce("");
export { debouncedValueAtom as TableSearchAtom };

export function TableFilter(
  props: Readonly<Omit<ComponentPropsWithRef<"input">, "onChange">>
) {
  const setKeyword = useSetAtom(debouncedValueAtom);
  const value = useAtomValue(currentValueAtom);

  return (
    <Input
      placeholder="Search"
      {...props}
      onChange={(e) => setKeyword(e.target.value)}
      value={value}
    />
  );
}
