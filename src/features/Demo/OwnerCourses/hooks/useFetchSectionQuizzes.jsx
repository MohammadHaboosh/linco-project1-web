import { useEffect } from "react";
import { quizApi } from "../api/quizApi";
import { isTempId } from "../utils/helpers";

export const useFetchSectionQuizzes = (
  currentStep,
  courseData,
  setCourseData,
) => {
  useEffect(() => {
    const fetchQuizzesForSections = async () => {
      if (!courseData.sections || courseData.sections.length === 0) return;

      const needsFetching = courseData.sections.some(
        (sec) => !isTempId(sec.id) && sec.isQuizFetched === undefined,
      );

      if (!needsFetching) return;

      const updatedSections = await Promise.all(
        courseData.sections.map(async (sec) => {
          if (isTempId(sec.id) || sec.isQuizFetched) {
            return sec;
          }

          try {
            const fetchedQuiz = await quizApi.getQuizBySectionId(sec.id);
            return {
              ...sec,
              quiz: fetchedQuiz || null,
              isQuizFetched: true,
            };
          } catch (error) {
            console.error(`Error fetching quiz for section ${sec.id}:`, error);
            return {
              ...sec,
              isQuizFetched: true,
            };
          }
        }),
      );

      setCourseData((prev) => ({
        ...prev,
        sections: updatedSections,
      }));
    };

    if (currentStep === 2 && courseData.id) {
      fetchQuizzesForSections();
    }
  }, [currentStep, courseData.id, courseData.sections, setCourseData]);
};
