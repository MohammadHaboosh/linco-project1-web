import { useState, useEffect } from "react";
import { lessonApi } from "../../OwnerCourses/api/lessonApi";
import { quizApi } from "../../OwnerCourses/api/quizApi";

export const useSectionLessons = (sectionId, isExpanded) => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!sectionId || !isExpanded || hasFetched) return;

    let isMounted = true;

    const fetchContent = async () => {
      try {
        await Promise.resolve();
        if (isMounted) setIsLoading(true);

        const lessonsData = await lessonApi.getLessons(sectionId);

        const quizData = await quizApi.getQuizBySectionId(sectionId);

        if (isMounted) {
          const combinedList = (lessonsData || []).sort(
            (a, b) => a.order - b.order,
          );

          if (quizData) {
            combinedList.push({
              ...quizData,
              isQuiz: true,
            });
          }

          setLessons(combinedList);
          setHasFetched(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load section content.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [sectionId, isExpanded, hasFetched]);

  return { lessons, isLoading, error };
};
