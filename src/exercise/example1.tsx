import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
export type Environment =
  | "Production"
  | "QA"
  | "Development"
  | "Staging";

export type DeploymentStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Failed";

export type Priority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export interface Deployment {
  id: string;
  application: string;
  version: string;
  environment: Environment;
  status: DeploymentStatus;
  requestedBy: string;
  requestedAt: string;
  scheduledAt: string;
  region: string;
  priority: Priority;
}
interface DeploymentCardProps {
  deployment: Deployment;
  onStatusChange?: (deploymentId: string, status: DeploymentStatus) => void;
}
const STATUS_FLOW: Record<DeploymentStatus, DeploymentStatus | null> = {
  Pending: "In Progress",
  "In Progress": "Completed",
  Completed: null,
};
const DeploymentCard = ({
  deployment,
  onStatusChange,
}: DeploymentCardProps) => {
  const nextStatus = STATUS_FLOW[deployment.status];
  const handleAdvanceStatus = () => {
    if (!nextStatus) {
      return;
    }
    onStatusChange?.(deployment.id, nextStatus);
  };
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };
  return (
    <Card className="w-full max-w-md">

      <CardHeader>

        <div className="flex items-start justify-between gap-4">

          <div>

            <CardTitle>{deployment.application}</CardTitle>
            <CardDescription className="mt-1">

              {deployment.id} • {deployment.version}
            </CardDescription>
          </div>
          <Badge variant="outline">{deployment.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="flex flex-wrap gap-2">

          <Badge>{deployment.environment}</Badge>
          <Badge variant="secondary"> {deployment.status} </Badge>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">

          <div>

            <p className="text-muted-foreground"> Requested By </p>
            <p className="font-medium"> {deployment.requestedBy} </p>
          </div>
          <div>

            <p className="text-muted-foreground"> Region </p>
            <p className="font-medium"> {deployment.region} </p>
          </div>
          <div>

            <p className="text-muted-foreground"> Requested At </p>
            <p className="font-medium">

              {formatDate(deployment.requestedAt)}
            </p>
          </div>
          <div>

            <p className="text-muted-foreground"> Scheduled At </p>
            <p className="font-medium">

              {formatDate(deployment.scheduledAt)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>

        {nextStatus ? (
          <Button className="w-full" onClick={handleAdvanceStatus}>

            Advance to {nextStatus}
          </Button>
        ) : (
          <Button className="w-full" disabled>

            Deployment Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default DeploymentCard;
export type {
  DeploymentCardProps
};
