import { apiFetch } from "../../../../api/apiFetch";

export const ownerCoursesApi = {
  getDemoAssets: async (demoId) => {
    if (!demoId) throw new Error("Demo ID is required");

    const response = await apiFetch(`/demos/${demoId}/assets/cursor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch owner courses");
    }

    console.log("Fetched Demo Assets:", data.data);
    return data.data;
  },
};
