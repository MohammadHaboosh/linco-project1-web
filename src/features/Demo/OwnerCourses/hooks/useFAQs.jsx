import { useState, useEffect, useCallback } from "react";
import { faqsApi } from "../api/faqsApi";

export const useFAQs = (courseId) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFaqs = useCallback(async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const res = await faqsApi.getFaqs(courseId);
      if (!res.success) {
        throw new Error("FAQ request was unsuccessful");
      }

      setFaqs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch course FAQs:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchFaqs();
    });
  }, [fetchFaqs]);

  const addFaq = async (faqData) => {
    try {
      const res = await faqsApi.createFaq(courseId, faqData);
      if (res.success) {
        setFaqs((prev) => [res.data, ...prev]);
        return { success: true };
      }
    } catch (err) {
      console.error("Failed to create a course FAQ:", err);
    }

    return { success: false };
  };

  const removeFaq = async (faqId) => {
    try {
      const res = await faqsApi.deleteFaq(courseId, faqId);
      if (res.success) {
        setFaqs((prev) => prev.filter((item) => item.id !== faqId));
        return { success: true };
      }
    } catch (err) {
      console.error("Failed to delete a course FAQ:", err);
    }

    return { success: false };
  };

  return {
    faqs,
    loading,
    error,
    addFaq,
    removeFaq,
    refetch: fetchFaqs,
  };
};
