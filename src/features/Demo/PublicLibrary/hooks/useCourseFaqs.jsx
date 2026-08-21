import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { faqsApi } from "../../OwnerCourses/api/faqsApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useCourseFaqs = (courseId, shouldFetch) => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
  const [faqsError, setFaqsError] = useState("");
  const [faqsRequestVersion, setFaqsRequestVersion] = useState(0);

  useEffect(() => {
    if (courseId && shouldFetch && faqs.length === 0) {
      const fetchFaqs = async () => {
        setIsLoadingFaqs(true);
        setFaqsError("");
        try {
          const response = await faqsApi.getFaqs(courseId);
          if (response.success && response.data) {
            setFaqs(response.data);
          }
        } catch (error) {
          console.error("Error fetching FAQs:", error);
          setFaqsError(
            getApiErrorMessage(error, t("course-faqs-load-failed")),
          );
        } finally {
          setIsLoadingFaqs(false);
        }
      };
      fetchFaqs();
    }
  }, [courseId, faqs.length, faqsRequestVersion, shouldFetch, t]);

  return {
    faqs,
    isLoadingFaqs,
    faqsError,
    retryFaqs: () => setFaqsRequestVersion((version) => version + 1),
  };
};
