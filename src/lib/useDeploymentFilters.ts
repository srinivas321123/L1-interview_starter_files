import { useMemo, useState } from "react";

import type { Deployment } from "../types";

export function useDeploymentFilters<T>(deployments: T[]) {
  const [search, setSearch] = useState("");

  const filteredDeployments = useMemo(() => {
    return deployments?.filter((deploymentDetails: T) => {
      return (deploymentDetails as Deployment).application
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [deployments, search]);
  /**
   * TODO
   *
   * Return:
   *
   * {
   *   search,
   *   setSearch,
   *   filteredDeployments
   * }
   */

  return {
    search,
    setSearch,
    filteredDeployments: filteredDeployments,
  };
}
