import type { deploymentStatuses } from "@/lib/deployment";

export type DeploymentStatus = (typeof deploymentStatuses)[number];

export interface Deployment {
  id: string;
  application: string;
  version: string;
  environment: "Production" | "QA" | "Development" | "Staging";
  status: DeploymentStatus;
  requestedBy: string;
  requestedAt: string;
  scheduledAt: string;
  region: string;
  priority: "Low" | "Medium" | "High" | "Critical";
}

export type StatusFilter = "All" | DeploymentStatus;
export type SortOrder = "default" | "earliest" | "latest";
export type SearchableDeployment = Pick<Deployment, "application">;

export interface DeploymentCardProps {
  deployment: Deployment;
  onAdvance?: (id: string) => void;
  isUpdating?: boolean;
}

export interface DeploymentSummaryProps {
  deployments: readonly Deployment[];
}

export interface DeploymentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  sort: SortOrder;
  onSortChange: (value: SortOrder) => void;
  onClear: () => void;
}
