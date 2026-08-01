import { apiFetch } from "../../../../api/apiFetch";

export const faqsApi = {
  getFaqs: async (courseId) => {
    const response = await apiFetch(`/courses/${courseId}/courseFaqs/cursor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Fetched FAQs:", data.data);
    return data;
  },

  createFaq: async (courseId, payload) => {
    const response = await apiFetch(`/courses/${courseId}/courseFaqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Created FAQ:", data.data);
    return data;
  },

  deleteFaq: async (courseId, faqId) => {
    const response = await apiFetch(
      `/courses/${courseId}/courseFaqs/${faqId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    console.log("Delete FAQ Response:", data);
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete FAQ");
    }
    return data;
  },
};
