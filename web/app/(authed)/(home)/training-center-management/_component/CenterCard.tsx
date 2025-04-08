import { ComponentPropsWithRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTE } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrainingCenter } from "@/lib/schemas/training-center";
import { User } from "next-auth";

export function CenterCard({
  center,
  className,
  ...props
}: {
  center: TrainingCenter;
} & ComponentPropsWithRef<"div">) {
  return (
    <div className="flex flex-col gap-2">
      <Card className={cn("", className)} {...props}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Training Center Information
            <Link href={ROUTE.HOME.trainingcenter.edit.path(center.id)}>
              <Button>Edit</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <div>Name: {center.name}</div>
              <div>Address: {center.address}</div>
              <div>Type: {center.type}</div>
              <div>Department: {center.department}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={cn("", className)} {...props}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Manager Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <div>Name: {center.manager.name}</div>
              <div>Email: {center.manager.email}</div>
              <div>Role: {center.manager.role}</div>
              <div>Phone Number: {center.manager.phone_number ?? "null"}</div>
              <div>Address: {center.manager.address ?? "null"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
