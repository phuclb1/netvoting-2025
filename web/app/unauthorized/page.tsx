import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
      <p>Bạn không có quyền truy cập trang này.</p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
