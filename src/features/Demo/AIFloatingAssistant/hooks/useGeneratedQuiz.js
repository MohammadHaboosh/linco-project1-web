import { useCallback, useEffect, useRef, useState } from "react";
import { courseAssistantApi } from "../api/courseAssistantApi";

export const useGeneratedQuiz = (courseId, quizType) => {
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const activeControllerRef = useRef(null);

  useEffect(
    () => () => {
      activeControllerRef.current?.abort();
      activeControllerRef.current = null;
    },
    [],
  );

  const generateQuiz = useCallback(
    async ({ topic, questionCount }) => {
      if (activeControllerRef.current) return null;

      const controller = new AbortController();
      activeControllerRef.current = controller;
      setIsGenerating(true);
      setError(null);

      try {
        const requestOptions = { signal: controller.signal };
        const generatedQuestions =
          quizType === "random"
            ? await courseAssistantApi.generateRandomQuiz(
                courseId,
                questionCount,
                requestOptions,
              )
            : await courseAssistantApi.generateTopicQuiz(
                courseId,
                { topic, questionCount },
                requestOptions,
              );

        if (controller.signal.aborted) return null;

        setQuestions(generatedQuestions);
        return generatedQuestions;
      } catch (requestError) {
        if (requestError.name === "AbortError") return null;

        setError(
          requestError.message || "The quiz could not be generated.",
        );
        return null;
      } finally {
        if (activeControllerRef.current === controller) {
          activeControllerRef.current = null;
          setIsGenerating(false);
        }
      }
    },
    [courseId, quizType],
  );

  const resetQuiz = useCallback(() => {
    activeControllerRef.current?.abort();
    activeControllerRef.current = null;
    setQuestions([]);
    setError(null);
    setIsGenerating(false);
  }, []);

  return {
    questions,
    isGenerating,
    error,
    generateQuiz,
    resetQuiz,
  };
};
