/**
 * ============================================================================
 * Exercise 1 - Deployment Card
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Your team is building an internal Deployment Queue application used by
 * Release Engineers to monitor application deployments.
 *
 * A mock API response has been provided in src/data/MOCK_DATA.ts.
 *
 * In this exercise, your task is to build a reusable DeploymentCard component.
 *
 * ============================================================================
 *
 * ## Requirements

### 1. Component Setup

- Create a `DeploymentCard` component.
- Keep the provided imports unchanged.
- Use React with TypeScript.
- Use the existing Shadcn UI components:
  - Card
  - Badge
  - Button
  - Separator

---
### 2. Deployment Interface

Create the `Deployment` interface with the mockdata properties:
make sure 
environment: "Production" | "QA" | "Development" | "Staging";
status: "Pending" | "In Progress" | "Completed";
priority: "Low" | "Medium" | "High" | "Critical";



 * ============================================================================
 *
 * UI Requirements
 *
 * • Use the provided shadcn/ui components where appropriate.
 *
 * • Environment and Status should be displayed using badges.
 *
 * • Display a "advance to [next status]" button at the bottom of the card.
 *
 * • Use appropriate spacing and visual hierarchy.
 *
 * • The component should remain responsive.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • Use TypeScript.
 *
 * • Define appropriate interfaces/types.
 *
 * • Keep the component reusable.
 *
 * • Do not hardcode values.
 *
 * • Avoid unnecessary duplication.
 *
 * • Write clean, maintainable code.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * We will evaluate:
 *
 * ✓ React Fundamentals
 * ✓ Component Composition
 * ✓ TypeScript
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 *
 * Note
 *
 * This exercise focuses only on the DeploymentCard component.
 *
 * Additional requirements will be introduced in later exercises.
 *
 * ============================================================================
 */

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
import type { Deployment, Environment, Status, Priority } from "@/types/deployment";


interface DeploymentCardProps {
  deployment: Deployment;
  onAdvance?: (id: string, nextStatus: Status) => void;
}

// Drives the "advance to next status" button without hardcoding
// transition logic inline in the JSX.
const STATUS_FLOW: Record<Status, Status | null> = {
  Pending: "In Progress",
  "In Progress": "Completed",
  Completed: null,
};

const ENVIRONMENT_STYLES: Record<Environment, string> = {
  Production: "bg-red-100 text-red-800 hover:bg-red-100",
  Staging: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  QA: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Development: "bg-slate-100 text-slate-800 hover:bg-slate-100",
};

const STATUS_STYLES: Record<Status, string> = {
  Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "In Progress": "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Completed: "bg-green-100 text-green-800 hover:bg-green-100",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  Low: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  High: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  Critical: "bg-red-100 text-red-800 hover:bg-red-100",
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const DeploymentCard = ({ deployment, onAdvance }: DeploymentCardProps) => {
  const {
    id,
    application,
    version,
    environment,
    status,
    requestedBy,
    requestedAt,
    scheduledAt,
    region,
    priority,
  } = deployment;

  const nextStatus = STATUS_FLOW[status];

  return (
    <Card className="w-full max-w-md ml-5 p-3">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg">{application}</CardTitle>
          <CardDescription>
            {version} &middot; {region} &middot; requested by {requestedBy}
          </CardDescription>
        </div>
        <Badge className={PRIORITY_STYLES[priority]} variant="secondary">
          {priority}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={ENVIRONMENT_STYLES[environment]} variant="secondary">
            {environment}
          </Badge>
          <Badge className={STATUS_STYLES[status]} variant="secondary">
            {status}
          </Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>Requested</span>
          <span>{formatDateTime(requestedAt)}</span>
          <span>Scheduled</span>
          <span>{formatDateTime(scheduledAt)}</span>
        </div>
      </CardContent>

      {nextStatus && (
        <CardFooter>
          <Button className="w-full" onClick={() => onAdvance?.(id, nextStatus)}>
            Advance to {nextStatus}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DeploymentCard;
