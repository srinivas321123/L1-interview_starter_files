/**
 * ============================================================================
 * Exercise 2 - useDeploymentFilters
 * ============================================================================
 */

import { useEffect, useState } from "react";
import { useDeploymentFilters } from "@/hooks/useDeploymentFilters";
import type { Deployment } from "@/types/deployment";

interface DeploymentFiltersProps {
  deployments: Deployment[];
  onFilteredChange: (deployments: Deployment[]) => void;
  onStatusChange: (status: string) => void;
}

const statuses = ["All", "Pending", "In Progress", "Completed"];

export default function SearchAndFilter({
  deployments,
  onFilteredChange,
  onStatusChange,
}: DeploymentFiltersProps) {
  const [status, setStatus] = useState("All");

  const {
    search,
    setSearch,
    filteredDeployments,
  } = useDeploymentFilters(deployments);

  useEffect(() => {
    const result = filteredDeployments.filter((deployment) => {
      if (status === "All") return true;
      return deployment.status === status;
    });

    onFilteredChange(result);
  }, [filteredDeployments, status, onFilteredChange]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange(value);
  };

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        Search & Filters
      </h2>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by application name..."
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />

      <div className="mt-5 flex flex-wrap gap-2">
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleStatusChange(item)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${status === item
              ? "border-black bg-black text-white"
              : "border-slate-200 bg-white text-black hover:bg-slate-50"
              }`}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}