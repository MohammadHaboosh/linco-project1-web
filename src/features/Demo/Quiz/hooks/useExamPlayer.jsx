import { useState, useEffect } from "react";
import { examAttemptApi } from "../api/examAttemptApi";
import { useParams } from "react-router-dom";

export const useExamPlayer = (passedExamId) => {
  const { demoId } = useParams();

  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);
  const [previousAttempt, setPreviousAttempt] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!passedExamId || !demoId) {
      queueMicrotask(() => {
        if (isMounted) {
          setIsLoading(false);
          setError(
            "Exam ID or Demo ID is missing. Cannot load the assessment.",
          );
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

    const loadExam = async () => {
      try {
        const attempts = await examAttemptApi.getMyAttempts(demoId);
        if (!isMounted) return;

        const existingAttempt = attempts?.find(
          (attempt) => attempt.examId === passedExamId,
        );

        if (existingAttempt) {
          setPreviousAttempt(existingAttempt);
          setIsLoading(false);
          return;
        }

        const data = await examAttemptApi.generateExam(passedExamId);

        if (!isMounted) return;

        const actualData = data.data || data;

        setExamData(actualData);

        const initialAnswers = {};
        if (actualData && actualData.questions) {
          actualData.questions.forEach((q) => {
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
  }, [passedExamId, demoId]);

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
        examId: passedExamId,
        answers: formattedAnswers,
      };

      const result = await examAttemptApi.submitAttempt(payload, demoId);
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
    previousAttempt,
  };
};
