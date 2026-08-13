import { useState, useEffect } from "react";
import { qAndAApi } from "../api/qAndAApi";

export const useQA = (demoId, lessonId) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!lessonId) {
      queueMicrotask(() => {
        if (isMounted) {
          setQuestions([]);
          setIsLoading(false);
        }
      });
      return;
    }

    queueMicrotask(() => {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
    });

    const fetchQuestions = async () => {
      try {
        const data = await qAndAApi.getQuestionsByLesson(lessonId);
        if (isMounted) setQuestions(data || []);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  const addQuestion = async (content) => {
    setIsPosting(true);
    try {
      const newQuestion = await qAndAApi.createQuestion(
        demoId,
        lessonId,
        content,
      );
      setQuestions((prev) => [newQuestion, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsPosting(false);
    }
  };

  const editQuestion = async (questionId, content) => {
    try {
      const updated = await qAndAApi.updateQuestion(
        demoId,
        lessonId,
        questionId,
        content,
      );
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? updated : q)),
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeQuestion = async (questionId) => {
    try {
      await qAndAApi.deleteQuestion(demoId, lessonId, questionId);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    questions,
    isLoading,
    error,
    isPosting,
    addQuestion,
    editQuestion,
    removeQuestion,
  };
};
