import { useState, useEffect } from "react";
import { faqsApi } from "../../OwnerCourses/api/faqsApi";

export const useCourseFaqs = (courseId, shouldFetch) => {
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);

  useEffect(() => {
    if (courseId && shouldFetch && faqs.length === 0) {
      const fetchFaqs = async () => {
        setIsLoadingFaqs(true);
        try {
          const response = await faqsApi.getFaqs(courseId);
          if (response.success && response.data) {
            setFaqs(response.data);
          }
        } catch (error) {
          console.error("Error fetching FAQs:", error);
        } finally {
          setIsLoadingFaqs(false);
        }
      };
      fetchFaqs();
    }
  }, [courseId, shouldFetch, faqs.length]);

  return {
    faqs,
    isLoadingFaqs,
  };
};
