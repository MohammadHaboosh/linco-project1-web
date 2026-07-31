import { apiFetch } from "../../../../api/apiFetch";

export const quizApi = {
  createQuiz: async (sectionId, quizData) => {
    const payload = {
      title: quizData.title,
      numberOfQuestions: Number(quizData.numberOfQuestions),
      durationMinutes: Number(quizData.durationMinutes),
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
    const response = await apiFetch(`/sections/${sectionId}/exams`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    const quiz =
      Array.isArray(data.data) && data.data.length > 0 ? data.data[0] : null;

    console.log("Fetched Quiz for section", sectionId, ":", quiz);
    return quiz;
  },
};
