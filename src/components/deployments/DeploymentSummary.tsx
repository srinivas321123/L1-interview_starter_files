import { Card, CardContent } from "@/components/ui/card";
import { deploymentStatuses } from "@/lib/deployment";
import type { DeploymentSummaryProps } from "@/types/deployment";

export function DeploymentSummary({ deployments }: DeploymentSummaryProps) {
  const metrics = [
    { label: "Total Deployments", count: deployments.length },
    ...deploymentStatuses.map((status) => ({
      label: status, count: deployments.filter((item) => item.status === status).length,
    })),
  ];
  return (
    <section aria-label="Deployment summary" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {metrics.map(({ label, count }) => (
        <Card key={label}>
          <CardContent><dl><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-2 text-3xl font-semibold tabular-nums">{count}</dd></dl></CardContent>
        </Card>
      ))}
    </section>
  );
}
