import { deploymentStatuses } from "@/lib/deployment";
import type { DeploymentToolbarProps, SortOrder, StatusFilter } from "@/types/deployment";
import { Button } from "@/components/ui/button";

const controlClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function DeploymentToolbar({ search, onSearchChange, status, onStatusChange, sort, onSortChange, onClear }: DeploymentToolbarProps) {
  return (
    <section aria-label="Deployment filters" className="flex flex-col gap-4 rounded-xl border bg-white p-4 md:flex-row md:items-end">
      <label className="flex-1 space-y-2 text-sm font-medium">
        <span className="block">Search applications</span>
        <input type="search" placeholder="Search by application name…" className={controlClass} value={search} onChange={(event) => onSearchChange(event.target.value)} />
      </label>
      <label className="space-y-2 text-sm font-medium md:w-44">
        <span className="block">Status</span>
        <select className={controlClass} value={status} onChange={(event) => onStatusChange(event.target.value as StatusFilter)}>
          {["All", ...deploymentStatuses].map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label className="space-y-2 text-sm font-medium md:w-52">
        <span className="block">Scheduled date</span>
        <select className={controlClass} value={sort} onChange={(event) => onSortChange(event.target.value as SortOrder)}>
          <option value="default">Default order</option><option value="earliest">Earliest first</option><option value="latest">Latest first</option>
        </select>
      </label>
      <Button variant="ghost" className="h-10" onClick={onClear} disabled={!search && status === "All" && sort === "default"}>Clear filters</Button>
    </section>
  );
}
