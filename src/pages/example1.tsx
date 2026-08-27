import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { Deployment } from "@/types/deployment";

interface DeploymentCardProps {
  deployment: Deployment;
}

const environmentBorder: Record<Deployment["environment"], string> = {
  Production: "border-l-orange-500",
  QA: "border-l-red-500",
  Development: "border-l-sky-500",
  Staging: "border-l-purple-500",
};

const DeploymentCard = ({ deployment }: DeploymentCardProps) => {
  const nextStatus =
    deployment.status === "Pending"
      ? "In Progress"
      : deployment.status === "In Progress"
        ? "Completed"
        : null;

  const scheduledDate = new Date(
    deployment.scheduledAt
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card
      className={`overflow-hidden border border-slate-200 border-l-4 ${environmentBorder[deployment.environment]} shadow-sm`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">
              {deployment.application}
            </CardTitle>

            <p className="mt-1 text-base text-muted-foreground">
              {deployment.version}
            </p>
          </div>

          <Badge
            variant="outline"
            className="rounded-full whitespace-nowrap"
          >
            {deployment.environment}
          </Badge>
        </div>

        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            Deployment ID
          </p>

          <p className="text-base font-semibold">
            {deployment.id}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Status + Priority */}
        <div className="flex items-center justify-between">
          <Badge
            variant={
              deployment.status === "Completed"
                ? "default"
                : "secondary"
            }
            className={
              deployment.status === "Pending"
                ? "border-yellow-200 bg-yellow-100 text-yellow-700"
                : deployment.status === "In Progress"
                  ? "border-blue-200 bg-blue-100 text-blue-700"
                  : "border-green-200 bg-green-100 text-green-700"
            }
          >
            {deployment.status}
          </Badge>

          <div className="text-sm text-muted-foreground">
            Priority{" "}
            <span className="font-semibold text-foreground">
              {deployment.priority}
            </span>
          </div>
        </div>

        <Separator />

        {/* Requested / Scheduled */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Requested By
            </p>

            <p className="mt-1 text-base font-medium">
              {deployment.requestedBy}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Scheduled
            </p>

            <p className="mt-1 text-base font-medium">
              {scheduledDate}
            </p>
          </div>
        </div>

        {/* Region / Environment */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Region
            </p>

            <p className="mt-1 text-base font-medium">
              {deployment.region}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Environment
            </p>

            <p className="mt-1 text-base font-medium">
              {deployment.environment}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-white pt-4">
        <Button
          className="w-full rounded-lg"
          disabled={!nextStatus}
        >
          {nextStatus
            ? `Advance to ${nextStatus}`
            : "✓ Completed"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentCard;