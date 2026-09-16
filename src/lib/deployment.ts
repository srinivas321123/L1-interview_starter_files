import type { DeploymentStatus } from "@/types/deployment";

export const deploymentStatuses = ["Pending", "In Progress", "Completed", "Failed"] as const;

export function getNextStatus(status: DeploymentStatus): DeploymentStatus | null {
  if (status === "Pending") return "In Progress";
  if (status === "In Progress") return "Completed";
  return null;
}
