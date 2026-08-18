import { apiFetch } from "../../../../api/apiFetch";

export const leaderboardApi = {
  getDepartmentLeaderboard: async (demoId, departmentId, options = {}) => {
    if (!demoId || !departmentId) {
      throw new Error("Demo ID and Department ID are required");
    }

    const response = await apiFetch(`/departments/leaderboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-demo-id": demoId,
        "x-department-id": departmentId,
      },
      signal: options.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Failed to fetch leaderboard.");
    }

    return data;
  },
};
