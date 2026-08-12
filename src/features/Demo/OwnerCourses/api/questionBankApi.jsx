import { apiFetch } from "../../../../api/apiFetch";

export const questionBankApi = {
  addQuestion: async (sectionId, questionData) => {
    const payload = {
      question: questionData.question,
      note: questionData.note,
      choices: questionData.choices,
    };

    const response = await apiFetch(`/sections/${sectionId}/questionsBank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add question to bank");
    }

    console.log("Created Question:", data.data);
    return data.data;
  },

  getQuestionsBySectionId: async (sectionId) => {
    const response = await apiFetch(
      `/sections/${sectionId}/questionsBank/cursor`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("get Question:", data.data);
    return data.data || [];
  },
};
