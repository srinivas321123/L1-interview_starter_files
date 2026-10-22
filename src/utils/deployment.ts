
import type {
  DeploymentStatus,
  Priority,
} from "@/types/deployment";

export const priorityColors: Record<Priority, string> = {
  Low: "border-l-emerald-500",
  Medium: "border-l-amber-500",
  High: "border-l-orange-500",
  Critical: "border-l-red-500",
};

export const statusStyles: Record<DeploymentStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-300",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-300",
  Completed: "bg-green-50 text-green-700 border-green-300",
  Failed: "bg-red-50 text-red-700 border-red-300",
};

export const statusOptions = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
  "Failed",
] as const;

export function getNextStatus(
  status: DeploymentStatus,
): DeploymentStatus | null {
  switch (status) {
    case "Pending":
      return "In Progress";
    case "In Progress":
      return "Completed";
    default:
      return null;
  }
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
