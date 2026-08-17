import { apiFetch } from "../../../../api/apiFetch";

export const answerApi = {
  getAnswersByQuestion: async (questionId) => {
    const response = await apiFetch(
      `/discussionQuestions/${questionId}/answers/cursor`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch answers");
    }

    console.log("Fetched answers:", data.data);
    return data.data || [];
  },

  createAnswer: async (demoId, questionId, content) => {
    const response = await apiFetch(
      `/discussionQuestions/${questionId}/answers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-demo-id": demoId,
        },
        body: JSON.stringify({ content }),
      },
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create answer");
    }

    console.log("Created answer:", data.data);
    return data.data;
  },

  updateAnswer: async (questionId, answerId, content) => {
    const response = await apiFetch(
      `/discussionQuestions/${questionId}/answers/${answerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update answer");
    }

    console.log("Updated answer:", data.data);
    return data.data;
  },

  deleteAnswer: async (questionId, answerId) => {
    const response = await apiFetch(
      `/discussionQuestions/${questionId}/answers/${answerId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data?.message || "Failed to delete answer");
    }

    console.log("Deleted answer:", answerId);
    return true;
  },
};
