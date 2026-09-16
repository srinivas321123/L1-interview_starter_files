

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

import { getNextStatus } from "@/lib/deployment";
import type { DeploymentCardProps } from "@/types/deployment";

const statusColors = {
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-800 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Failed: "bg-red-50 text-red-800 border-red-200",
};

const DeploymentCard = ({ deployment, onAdvance, isUpdating = false }: DeploymentCardProps) => {
  const nextStatus = getNextStatus(deployment.status);
  const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium", timeStyle: "short", timeZone: "UTC",
  }).format(new Date(value));

  return (
    <Card className="h-full shadow-sm" role="article" aria-label={`${deployment.application} deployment`}>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardDescription className="font-mono text-xs">{deployment.id}</CardDescription>
          <Badge variant="outline" className={statusColors[deployment.status]}>{deployment.status}</Badge>
        </div>
        <CardTitle><h2 className="text-lg font-semibold">{deployment.application}</h2></CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{deployment.version}</span>
          <Badge variant="secondary">{deployment.environment}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <Separator />
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-muted-foreground">Requested by</dt><dd className="mt-1">{deployment.requestedBy}</dd></div>
          <div><dt className="text-muted-foreground">Region</dt><dd className="mt-1">{deployment.region}</dd></div>
          <div><dt className="text-muted-foreground">Priority</dt><dd className="mt-1 font-medium">{deployment.priority}</dd></div>
          <div><dt className="text-muted-foreground">Requested</dt><dd className="mt-1"><time dateTime={deployment.requestedAt}>{formatDate(deployment.requestedAt)} UTC</time></dd></div>
          <div className="col-span-2"><dt className="text-muted-foreground">Scheduled</dt><dd className="mt-1"><time dateTime={deployment.scheduledAt}>{formatDate(deployment.scheduledAt)} UTC</time></dd></div>
        </dl>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" disabled={!nextStatus || !onAdvance || isUpdating} onClick={() => onAdvance?.(deployment.id)}>
          {isUpdating ? "Updating…" : nextStatus ? `Advance to ${nextStatus}` : deployment.status === "Completed" ? "Deployment completed" : "Deployment failed"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentCard;
