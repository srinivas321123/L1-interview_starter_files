import { data } from "@/data/MOCK_DATA";
import { getNextStatus } from "@/lib/deployment";
import type { Deployment } from "@/types/deployment";

// In-memory mock server: changes survive refetching, but reset on page reload.
let deployments: Deployment[] = data.map((deployment) => ({ ...deployment }));
const delay = () => new Promise((resolve) => setTimeout(resolve, 500));

export async function getDeployments(): Promise<Deployment[]> {
  await delay();
  return deployments.map((deployment) => ({ ...deployment }));
}

export async function advanceDeployment(id: string): Promise<Deployment> {
  await delay();
  const deployment = deployments.find((item) => item.id === id);
  if (!deployment) throw new Error("Deployment not found.");
  const status = getNextStatus(deployment.status);
  if (!status) throw new Error("This deployment cannot be advanced.");
  const updated = { ...deployment, status };
  deployments = deployments.map((item) => item.id === id ? updated : item);
  return { ...updated };
}
