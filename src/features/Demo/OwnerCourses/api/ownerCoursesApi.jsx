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

  publishCourse: async (courseId) => {
    const response = await apiFetch(`/courses/${courseId}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Failed to publish course");
    }

    console.log("Course Publish response:", data);
    return data;
  },
};
