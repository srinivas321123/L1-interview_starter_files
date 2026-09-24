

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

export interface Deployment {
  id: string;
  application: string;
  version: string;
  environment: "Production" | "QA" | "Development" | "Staging";
  status: "Pending" | "In Progress" | "Completed";
  requestedBy: string;
  requestedAt: string;
  scheduledAt: string;
  region: string;
  priority: "Low" | "Medium" | "High" | "Critical";
}
interface DeploymentCardProps {
  deployment: Deployment;
}

const DeploymentCard = ({ deployment }: DeploymentCardProps) => {
  const statusFlow: Record<Deployment["status"], Deployment["status"] | null> = {
    Pending: "In Progress",
    "In Progress": "Completed",
    Completed: null,
  };

  const nextStatus = statusFlow[deployment.status];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{deployment.application}</CardTitle>
        <CardDescription>
          <div>{deployment.id}</div>
          <div>{deployment.version}</div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2">
          <Badge>{deployment.environment}</Badge>
          <Badge>{deployment.status}</Badge>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <p>{deployment.requestedBy}</p>
          <p>
            Scheduled:{" "}
            {new Date(deployment.scheduledAt).toLocaleString()}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button disabled={!nextStatus}>
          {nextStatus ? `Advance to ${nextStatus}` : "Completed"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentCard;
