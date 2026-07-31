import { useState, useEffect, useCallback } from "react";
import { faqsApi } from "../api/faqsApi";

export const useFAQs = (courseId) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaqs = useCallback(async () => {
    if (!courseId) return;
    try {
      const res = await faqsApi.getFaqs(courseId);
      if (res.success) {
        setFaqs(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch FAQs");
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
      return { success: false, error: err.message };
    }
  };

  const removeFaq = async (faqId) => {
    try {
      const res = await faqsApi.deleteFaq(courseId, faqId);
      if (res.success) {
        setFaqs((prev) => prev.filter((item) => item.id !== faqId));
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
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
