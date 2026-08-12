import { useState } from "react";
import { questionBankApi } from "../api/questionBankApi";

export const useQuestionBank = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const addQuestion = async (sectionId, questionData) => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await questionBankApi.addQuestion(
        sectionId,
        questionData,
      );
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create question";
      setError(errorMessage);
      throw new Error(errorMessage, { cause: err });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    addQuestion,
    isCreating,
    error,
  };
};
