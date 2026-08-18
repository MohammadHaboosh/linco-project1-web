import { apiFetch } from "../../../../api/apiFetch";

export const ownerReportApi = {
  getDemoOwnerReport: async (demoId) => {
    if (!demoId) throw new Error("Demo ID is required");

    const response = await apiFetch(`/reports/demo-owner`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-demo-id": demoId,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch owner report");
    }
    return data.data;
  },
};
