import { useState, useCallback } from "react";
import { answerApi } from "../api/answerApi";

export const useAnswers = (demoId, questionId, initialAnswers = []) => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnswers = useCallback(async () => {
    if (!questionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await answerApi.getAnswersByQuestion(questionId);
      setAnswers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [questionId]);

  const addAnswer = async (content) => {
    setIsSubmitting(true);
    try {
      const newAnswer = await answerApi.createAnswer(
        demoId,
        questionId,
        content,
      );
      setAnswers((prev) => [...prev, newAnswer]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const editAnswer = async (answerId, content) => {
    try {
      const updatedAnswer = await answerApi.updateAnswer(
        questionId,
        answerId,
        content,
      );
      setAnswers((prev) =>
        prev.map((ans) => (ans.id === answerId ? updatedAnswer : ans)),
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeAnswer = async (answerId) => {
    try {
      await answerApi.deleteAnswer(questionId, answerId);
      setAnswers((prev) => prev.filter((ans) => ans.id !== answerId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    answers,
    isLoading,
    error,
    isSubmitting,
    fetchAnswers,
    addAnswer,
    editAnswer,
    removeAnswer,
  };
};
