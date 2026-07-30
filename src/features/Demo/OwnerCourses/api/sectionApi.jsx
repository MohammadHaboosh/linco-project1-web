import { apiFetch } from "../../../../api/apiFetch";

export const sectionApi = {
  getSections: async (courseId) => {
    const response = await apiFetch(`/courses/${courseId}/sections/cursor`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Fetched Course Sections:", data.data);
    return data.data;
  },

  createSection: async (courseId, payload) => {
    const response = await apiFetch(`/courses/${courseId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Created Course Section:", data.data);
    return data.data;
  },
};
