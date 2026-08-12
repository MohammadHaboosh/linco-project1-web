import { apiFetch } from "../../../../api/apiFetch";

export const quizApi = {
  createQuiz: async (sectionId, quizData) => {
    const payload = {
      title: quizData.title,
      numberOfQuestions: Number(quizData.numberOfQuestions),
      durationMinutes: Number(quizData.durationMinutes),
      passingScore: Number(quizData.passingScore),
    };

    const response = await apiFetch(`/sections/${sectionId}/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Created Quiz:", data.data);
    return data.data;
  },

  getQuizBySectionId: async (sectionId) => {
    const response = await apiFetch(`/sections/${sectionId}/exams/cursor`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    let quiz = null;
    const payload = data.data;
    if (Array.isArray(payload)) {
      quiz = payload.length > 0 ? payload[0] : null;
    } else if (payload && Array.isArray(payload.exams)) {
      quiz = payload.exams.length > 0 ? payload.exams[0] : null;
    } else if (payload && typeof payload === "object") {
      quiz = payload;
    }

    console.log("Fetched Quiz for section", sectionId, ":", quiz);
    return quiz;
  },

  deleteQuiz: async (sectionId, examId) => {
    const response = await apiFetch(`/sections/${sectionId}/exams/${examId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("Delete Quiz Response:", data);
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete quiz");
    }
    return data.data;
  },

  updateQuiz: async (sectionId, examId, quizData) => {
    const payload = {
      title: quizData.title,
      numberOfQuestions: Number(quizData.numberOfQuestions),
      durationMinutes: Number(quizData.durationMinutes),
      passingScore: Number(quizData.passingScore),
    };

    const response = await apiFetch(`/sections/${sectionId}/exams/${examId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update quiz");
    }

    console.log("Updated Quiz:", data.data);
    return data.data;
  },
};
