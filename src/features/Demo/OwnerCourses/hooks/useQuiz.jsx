import { useState } from "react";
import { quizApi } from "../api/quizApi";

export const useQuiz = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createQuiz = async (sectionId, quizData) => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await quizApi.createQuiz(sectionId, quizData);
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create quiz";
      setError(errorMessage);
      throw new Error(errorMessage, { cause: err });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createQuiz,
    isCreating,
    error,
  };
};
