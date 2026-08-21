import { apiFetch } from "../../../../api/apiFetch";

export const examAttemptApi = {
  getMyAttempts: async (demoId) => {
    const response = await apiFetch(`/examAttempts/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-demo-id": demoId,
      },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch exam attempts");
    }

    return data.data;
  },

  generateExam: async (examId) => {
    const response = await apiFetch(`/examAttempts/generate/${examId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to retrieve exam");
    }

    return data.data;
  },

  submitAttempt: async (payload, demoId) => {
    const response = await apiFetch(`/examAttempts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-demo-id": demoId,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to submit exam");
    }

    return data;
  },
};
