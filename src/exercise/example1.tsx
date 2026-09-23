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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { Deployment, DeploymentStatus } from "../types";

interface Props {
  deployment: Deployment;
  handleStatusChange?: (id: string, status: DeploymentStatus) => void;
}

const DeploymentCard = ({ deployment, handleStatusChange }: Props) => {
  const getNextStatus = (status: DeploymentStatus) => {
    switch (status) {
      case "Pending":
        return "In Progress";
      case "In Progress":
        return "Completed";
      case "Completed":
        return "Completed";
      default:
        return "Pending";
    }
  };

  const nextStatus = getNextStatus(deployment?.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyles = (status: DeploymentStatus) => {
    switch (status) {
      case "Pending":
        return {
          border: "border-l-orange-500",
          badge: "bg-orange-50 text-orange-600 border-orange-200",
        };

      case "In Progress":
        return {
          border: "border-l-red-500",
          badge: "bg-blue-50 text-blue-600 border-blue-200",
        };

      case "Completed":
        return {
          border: "border-l-sky-500",
          badge: "bg-green-50 text-green-600 border-green-200",
        };

      default:
        return {
          border: "border-l-gray-300",
          badge: "bg-gray-50 text-gray-600 border-gray-200",
        };
    }
  };

  const statusStyles = getStatusStyles(deployment.status);

  return (
    <Card
      className={`
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        border-l-3
        ${statusStyles.border}
        bg-white
        shadow-none
      `}
    >
      {/* Header */}
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-base font-semibold text-gray-900">
              {deployment.application}
            </CardTitle>

            <p className="mt-1 text-xs text-gray-500">{deployment.version}</p>
          </div>

          <Badge
            variant="outline"
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
          >
            {deployment.environment}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-4 pb-0">
        {/* Deployment ID */}
        <div className="mb-4">
          <p className="text-[11px] text-gray-500">Deployment ID</p>

          <p className="mt-0.5 text-xs font-semibold text-gray-900">
            {deployment.id}
          </p>
        </div>

        {/* Display status */}
        <div className="mb-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles.badge}`}
          >
            {deployment.status}
          </Badge>

          <p className="text-xs text-gray-500">
            Priority{" "}
            <span className="font-semibold text-gray-900">
              {deployment.priority}
            </span>
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <p className="text-[11px] text-gray-500">Requested By</p>

            <p className="mt-0.5 truncate text-xs font-medium text-gray-900">
              {deployment.requestedBy}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-gray-500">Scheduled</p>

            <p className="mt-0.5 text-xs font-medium text-gray-900">
              {formatDate(deployment.scheduledAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4">
          <div>
            <p className="text-[11px] text-gray-500">Region</p>

            <p className="mt-0.5 text-xs font-medium text-gray-900">
              {deployment.region}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-gray-500">Environment</p>

            <p className="mt-0.5 text-xs font-medium text-gray-900">
              {deployment.environment}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-3 pt-0">
        <Button
          className={`
            h-8
            w-full
            rounded-md
            text-xs
            font-semibold
            ${
              deployment.status === "Completed"
                ? "bg-gray-400 text-white hover:bg-gray-400"
                : "bg-gray-900 text-white hover:bg-black"
            }
          `}
          disabled={deployment.status === "Completed"}
          onClick={() => {
            handleStatusChange?.(deployment.id, nextStatus);
          }}
        >
          {deployment.status === "Completed"
            ? "✓ Completed"
            : `Advance to ${nextStatus}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentCard;
