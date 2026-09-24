import {data} from "../data/MOCK_DATA";
import type { Deployment } from "../exercise/example1";

export async function getDeployments(): Promise<Deployment[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return data;
}