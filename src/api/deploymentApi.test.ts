import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => { vi.resetModules(); vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe("mock deployment API", () => {
  it("persists valid transitions across refetches without changing fixture data", async () => {
    const { advanceDeployment, getDeployments } = await import("./deploymentApi");
    const { data } = await import("@/data/MOCK_DATA");
    const first = advanceDeployment("DEP-1001");
    await vi.runAllTimersAsync();
    expect((await first).status).toBe("In Progress");
    const second = advanceDeployment("DEP-1001");
    await vi.runAllTimersAsync();
    expect((await second).status).toBe("Completed");
    const fetched = getDeployments();
    await vi.runAllTimersAsync();
    expect((await fetched)[0].status).toBe("Completed");
    expect(data[0].status).toBe("Pending");
  });

  it.each(["missing", "DEP-1003"])("rejects invalid advancement for %s", async (id) => {
    const { advanceDeployment } = await import("./deploymentApi");
    const assertion = expect(advanceDeployment(id)).rejects.toThrow();
    await vi.runAllTimersAsync();
    await assertion;
  });
});
