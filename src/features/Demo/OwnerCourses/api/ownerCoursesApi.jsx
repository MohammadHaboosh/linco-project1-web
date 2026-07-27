import { apiFetch } from "../../../../api/apiFetch";

export const ownerCoursesApi = {
  getDemoAssets: async (demoId) => {
    if (!demoId) throw new Error("Demo ID is required");

    const response = await apiFetch(`/assets/cursor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-demo-id": demoId,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch owner courses");
    }

    console.log("Fetched Demo Assets:", data.data);
    return data.data;
  },

  updateCourseGeneralInfo: async (courseId, payload) => {
    const response = await apiFetch(`/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Updated Course General Info:", data.data);
    return data.data;
  },
};
