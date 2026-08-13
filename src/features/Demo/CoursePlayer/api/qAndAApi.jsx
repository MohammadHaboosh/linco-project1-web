import { apiFetch } from "../apiFetch";

export const qAndAApi = {
  getQuestionsByLesson: async (lessonId) => {
    const response = await apiFetch(
      `/lessons/${lessonId}/discussionQuestions/cursor`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch questions");
    }

    console.log("Fetched questions:", data.data);
    return data.data;
  },

  createQuestion: async (demoId, lessonId, content) => {
    const response = await apiFetch(
      `/lessons/${lessonId}/discussionQuestions`,
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
      throw new Error(data.message || "Failed to create question");
    }

    console.log("Created question:", data.data);
    return data.data;
  },

  updateQuestion: async (demoId, lessonId, questionId, content) => {
    const response = await apiFetch(
      `/lessons/${lessonId}/discussionQuestions/${questionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-demo-id": demoId,
        },
        body: JSON.stringify({ content }),
      },
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update question");
    }

    console.log("Updated question:", data.data);
    return data.data;
  },

  deleteQuestion: async (demoId, lessonId, questionId) => {
    const response = await apiFetch(
      `/lessons/${lessonId}/discussionQuestions/${questionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-demo-id": demoId,
        },
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to delete question");
    }

    return true;
  },
};
