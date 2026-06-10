import { beforeEach, describe, expect, it, vi } from "vitest";

describe("student data loading", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("shares categories and FAQ responses across repeated page loads", async () => {
    const fetchMock = vi.fn(async (url) => ({
      ok: true,
      json: async () =>
        url.includes("/categories")
          ? { current: [{ id: "planning" }], future: [{ id: "apply" }] }
          : [{ id: 1 }],
    }));
    vi.stubGlobal("fetch", fetchMock);

    const { loadStudentData } = await import("./studentData");

    await loadStudentData("current");
    await loadStudentData("current");
    await loadStudentData("future");

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(
      fetchMock.mock.calls.filter(([url]) => url.includes("/categories"))
    ).toHaveLength(1);
  });

  it("removes failed requests from the cache so they can be retried", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Temporary error" }),
      })
      .mockResolvedValue({
        ok: true,
        json: async () => ({ current: [], future: [] }),
      });
    vi.stubGlobal("fetch", fetchMock);

    const { loadStudentData } = await import("./studentData");

    await expect(loadStudentData("current")).rejects.toThrow();
    await expect(loadStudentData("current")).resolves.toEqual({
      questions: { current: [], future: [] },
      categories: [],
    });
  });
});
