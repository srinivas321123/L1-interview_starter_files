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
 * • Color the left border of the card based on priority.
 *   Priority values in the data are: Low, Medium, High, and Critical.
 *   Choose a distinct color for each priority.
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

import type { Deployment, DeploymentStatus } from "@/types/deployment";

import {
  formatDate,
  getNextStatus,
  priorityColors,
  statusStyles,
} from "@/utils/deployment";
import { Check } from "lucide-react";

interface DeploymentCardProps {
  deployment: Deployment;
  onAdvance?: (id: string, nextStatus: DeploymentStatus) => void;
}



const DeploymentCard = ({ deployment, onAdvance }: DeploymentCardProps) => {
  const nextStatus = getNextStatus(deployment.status);

  return (
    <Card
      className={`h-full gap-0 overflow-hidden rounded-xl border border-slate-200 border-l-[3px] py-0 shadow-none ring-0 ${priorityColors[deployment.priority]}`}
    >
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold text-slate-900">
              {deployment.application}
            </CardTitle>

            <CardDescription className="mt-1 text-[11px] text-slate-400">
              {deployment.version}
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className="h-5 rounded-full border-slate-200 px-2 text-[10px] font-normal text-slate-700"
          >
            {deployment.environment}
          </Badge>
        </div>

        <div className="mt-3">
          <p className="text-[10px] text-slate-400">
            Deployment ID
          </p>
          <p className="text-xs font-semibold text-slate-900">
            {deployment.id}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={`h-5 rounded-full px-2 text-[10px] font-medium ${statusStyles[deployment.status]}`}
          >
            {deployment.status}
          </Badge>

          <p className="text-[11px] text-slate-500">
            Priority{" "}
            <span className="font-semibold text-slate-900">
              {deployment.priority}
            </span>
          </p>
        </div>
      </CardHeader>

      <div className="px-4">
        <Separator className="bg-slate-200" />
      </div>

      <CardContent className="flex-1 px-4 py-3">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <dt className="text-[10px] text-slate-400">
              Requested By
            </dt>
            <dd className="mt-0.5 text-[11px] font-semibold text-slate-900">
              {deployment.requestedBy}
            </dd>
          </div>

          <div>
            <dt className="text-[10px] text-slate-400">
              Scheduled
            </dt>
            <dd className="mt-0.5 text-[11px] font-semibold text-slate-900">
              {formatDate(deployment.scheduledAt)}
            </dd>
          </div>

          <div>
            <dt className="text-[10px] text-slate-400">
              Region
            </dt>
            <dd className="mt-0.5 text-[11px] font-semibold text-slate-900">
              {deployment.region}
            </dd>
          </div>

          <div>
            <dt className="text-[10px] text-slate-400">
              Environment
            </dt>
            <dd className="mt-0.5 text-[11px] font-semibold text-slate-900">
              {deployment.environment}
            </dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="mt-auto border-t border-slate-100 bg-slate-50 px-3 py-3">
        {nextStatus ? (
          <Button
            type="button"
            className="h-8 w-full rounded-md bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-800"
            disabled={!onAdvance}
            onClick={() => onAdvance?.(deployment.id, nextStatus)}
          >
            Advance to {nextStatus}
          </Button>
        ) : (
          <Button
            type="button"
            disabled
            className="h-8 w-full rounded-md bg-neutral-400 text-xs font-semibold text-white opacity-100"
          >
            {deployment.status === "Completed" && (
              <Check className="size-3" />
            )}
            {deployment.status}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DeploymentCard;
