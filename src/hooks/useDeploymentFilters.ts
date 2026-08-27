import { useMemo, useState } from "react";
import type { Deployment } from "@/types/deployment";

export function useDeploymentFilters(deployments: Deployment[]) {
  const [search, setSearch] = useState("");

  const filteredDeployments = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return deployments;
    }

    return deployments.filter((deployment) =>
      deployment.application.toLowerCase().includes(value)
    );
  }, [deployments, search]);

  return {
    search,
    setSearch,
    filteredDeployments,
  };
}