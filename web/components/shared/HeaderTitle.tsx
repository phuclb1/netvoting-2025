"use client";

import { usePathname } from "next/navigation";
import { getTitleFromUrl } from "@/lib/gettitle";

export const PageTitle = () => {
  const pathname = usePathname();
  const title = getTitleFromUrl(pathname);
  console.log("pathname", pathname);

  return <span className=" text-[18px] font-semibold">{title}</span>;
};
