import { apiFetch } from "../../../../api/apiFetch";

export const libraryApi = {
  getCourses: async (demoId) => {
    if (!demoId) throw new Error("Demo ID is required");

    const response = await apiFetch(`/courses/cursor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch public courses");
    }

    console.log("Fetched public Courses:", data.data);
    return data.data;
  },

  getAllTags: async () => {
    const response = await apiFetch(`/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch tags");
    }

    console.log("Fetched Tags:", data.data);
    return data.data;
  },
};
