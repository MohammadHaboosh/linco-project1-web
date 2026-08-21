import { useState, useEffect, useCallback } from "react";
import { faqsApi } from "../api/faqsApi";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useFAQs = (courseId) => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFaqs = useCallback(async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await faqsApi.getFaqs(courseId);
      if (!res.success) {
        throw new Error(res.message || t("course-faqs-load-failed"));
      }

      setFaqs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch course FAQs:", err);
      setError(
        getApiErrorMessage(err, t("course-faqs-load-failed")),
      );
    } finally {
      setLoading(false);
    }
  }, [courseId, t]);

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

      return {
        success: false,
        error: getApiErrorMessage(res, t("faq-create-failed")),
      };
    } catch (err) {
      console.error("Failed to create a course FAQ:", err);
      return {
        success: false,
        error: getApiErrorMessage(err, t("faq-create-failed")),
      };
    }
  };

  const removeFaq = async (faqId) => {
    try {
      const res = await faqsApi.deleteFaq(courseId, faqId);
      if (res.success) {
        setFaqs((prev) => prev.filter((item) => item.id !== faqId));
        return { success: true };
      }

      return {
        success: false,
        error: getApiErrorMessage(res, t("faq-delete-failed")),
      };
    } catch (err) {
      console.error("Failed to delete a course FAQ:", err);
      return {
        success: false,
        error: getApiErrorMessage(err, t("faq-delete-failed")),
      };
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
