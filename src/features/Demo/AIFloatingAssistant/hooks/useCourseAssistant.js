import { useCallback, useEffect, useRef, useState } from "react";
import { courseAssistantApi } from "../api/courseAssistantApi";

export const useCourseAssistant = (courseId) => {
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState(null);
  const [failedQuestion, setFailedQuestion] = useState(null);
  const activeControllerRef = useRef(null);
  const nextMessageIdRef = useRef(1);

  useEffect(
    () => () => {
      activeControllerRef.current?.abort();
      activeControllerRef.current = null;
    },
    [],
  );

  const createMessage = useCallback((role, text) => {
    const message = {
      id: `${role}-${nextMessageIdRef.current}`,
      role,
      text,
    };

    nextMessageIdRef.current += 1;
    return message;
  }, []);

  const requestAnswer = useCallback(
    async (question, { includeUserMessage = true } = {}) => {
      const normalizedQuestion = String(question ?? "").trim();
      if (!normalizedQuestion || activeControllerRef.current) return false;

      const controller = new AbortController();
      activeControllerRef.current = controller;

      if (includeUserMessage) {
        setMessages((current) => [
          ...current,
          createMessage("user", normalizedQuestion),
        ]);
      }

      setIsAsking(true);
      setError(null);

      try {
        const answer = await courseAssistantApi.askQuestion(
          courseId,
          normalizedQuestion,
          { signal: controller.signal },
        );

        if (controller.signal.aborted) return false;

        setMessages((current) => [
          ...current,
          createMessage("assistant", answer),
        ]);
        setFailedQuestion(null);
        return true;
      } catch (requestError) {
        if (requestError.name === "AbortError") return false;

        setError(
          requestError.message ||
            "The course assistant could not answer right now.",
        );
        setFailedQuestion(normalizedQuestion);
        return false;
      } finally {
        if (activeControllerRef.current === controller) {
          activeControllerRef.current = null;
          setIsAsking(false);
        }
      }
    },
    [courseId, createMessage],
  );

  const retryLastQuestion = useCallback(() => {
    if (!failedQuestion) return Promise.resolve(false);
    return requestAnswer(failedQuestion, { includeUserMessage: false });
  }, [failedQuestion, requestAnswer]);

  const dismissError = useCallback(() => setError(null), []);

  return {
    messages,
    isAsking,
    error,
    askQuestion: requestAnswer,
    retryLastQuestion,
    dismissError,
  };
};
