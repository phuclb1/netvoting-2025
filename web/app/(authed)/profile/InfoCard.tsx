import { User } from "next-auth";
import { ComponentPropsWithRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTE } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";

export function InfoCard({
  user,
  className,
  ...props
}: {
  user: User;
} & ComponentPropsWithRef<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          General Information
          <Link href={ROUTE.HOME.humanresource.edit.path(user.id)}>
            <Button>Edit</Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <UserAvatar className="h-20 w-20 text-3xl" user={user} />
          <div className="flex flex-col gap-2">
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
            <div>Phone Number: {user.phone_number}</div>
            <div>Address: {user.address}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-4">
        <Button variant="destructive">Delete Account</Button>
      </CardFooter>
    </Card>
  );
}
