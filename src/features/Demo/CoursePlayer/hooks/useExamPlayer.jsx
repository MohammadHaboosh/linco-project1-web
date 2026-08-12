import { useState, useEffect } from "react";
import { examAttemptApi } from "../api/examAttemptApi";

export const useExamPlayer = (examId) => {
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);

  useEffect(() => {
    if (!examId) return;

    let isMounted = true;

    queueMicrotask(() => {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
    });

    const loadExam = async () => {
      try {
        const data = await examAttemptApi.generateExam(examId);

        if (!isMounted) return;

        setExamData(data);

        const initialAnswers = {};
        if (data && data.questions) {
          data.questions.forEach((q) => {
            initialAnswers[q.id] = [];
          });
        }
        setAnswers(initialAnswers);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadExam();

    return () => {
      isMounted = false;
    };
  }, [examId]);

  const toggleChoice = (questionId, choiceId) => {
    setAnswers((prev) => {
      const currentSelected = prev[questionId] || [];
      const isAlreadySelected = currentSelected.includes(choiceId);

      if (isAlreadySelected) {
        return {
          ...prev,
          [questionId]: currentSelected.filter((id) => id !== choiceId),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentSelected, choiceId],
        };
      }
    });
  };

  const submitExam = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([qId, choiceIds]) => ({
          questionId: qId,
          selectedChoiceIds: choiceIds,
        }),
      );

      const payload = {
        examId: examId,
        answers: formattedAnswers,
      };

      const result = await examAttemptApi.submitAttempt(payload);
      setExamResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    examData,
    isLoading,
    isSubmitting,
    error,
    answers,
    toggleChoice,
    submitExam,
    examResult,
  };
};
