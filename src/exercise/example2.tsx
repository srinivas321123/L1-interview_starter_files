import { useMemo, useState } from "react";

type DeploymentWithApplication = {
  application: string;
};

export function useDeploymentFilters<
  T extends DeploymentWithApplication
>(deployments: T[]) {
  const [search, setSearch] = useState("");

  const filteredDeployments = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return deployments;
    }

    return deployments.filter((deployment) =>
      deployment.application
        .toLowerCase()
        .includes(searchText)
    );
  }, [deployments, search]);

  return {
    search,
    setSearch,
    filteredDeployments,
  };
}

const SearchPlaceholder = () => {
  return null;
};

export default SearchPlaceholder;