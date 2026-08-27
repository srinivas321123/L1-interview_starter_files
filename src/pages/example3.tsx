import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { data } from "@/data/MOCK_DATA";
import DeploymentCard from "./example1";
import SearchAndFilter from "./example2";

import type { Deployment } from "@/types/deployment";

export default function Example3() {
  const [filteredDeployments, setFilteredDeployments] = useState<
    Deployment[]
  >([]);

  const {
    data: deployments = [],
    isLoading,
    isError,
  } = useQuery<Deployment[]>({
    queryKey: ["deployments"],
    queryFn: async () => data as Deployment[],
  });

  const handleFilteredChange = (items: Deployment[]) => {
    setFilteredDeployments(items);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center">Loading deployments...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-red-600">
            Failed to load deployments.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <section className="rounded-2xl bg-slate-950 px-6 py-7 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                🚀 Deployment Queue
              </h1>

              <p className="mt-2 text-slate-300">
                Monitor deployment requests across environments.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 px-8 py-4 text-center">
              <p className="text-xs uppercase text-slate-400">
                Active Deployments
              </p>

              <p className="text-4xl font-bold">
                {deployments.length}
              </p>
            </div>
          </div>
        </section>

        {/* EXERCISE 2 */}
        <SearchAndFilter
          deployments={deployments}
          onFilteredChange={handleFilteredChange}
          onStatusChange={() => { }}
        />

        {/* COUNT */}
        <p className="text-sm text-slate-500">
          Showing {filteredDeployments.length} of {deployments.length} deployments
        </p>

        {/* CARDS */}
        {filteredDeployments.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <h3 className="font-semibold">
              No deployments found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeployments.map((deployment) => (
              <DeploymentCard
                key={deployment.id}
                deployment={deployment}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}