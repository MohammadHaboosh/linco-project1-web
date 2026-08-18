import { apiFetch } from "../../../../api/apiFetch";

export const publishCourseApi = {
  createTag: async (name) => {
    const response = await apiFetch("/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create tag");
    }
    return data.data;
  },

  createCourse: async (coursePayload) => {
    const response = await apiFetch("/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coursePayload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create course");
    }
    return data.data;
  },
};
