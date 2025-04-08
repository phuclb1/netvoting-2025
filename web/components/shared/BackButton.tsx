import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
}

export function BackButton({ href }: BackButtonProps) {
  return (
    <Link className="w-fit" href={href}>
      <Button variant="ghost">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </Link>
  );
}
