import { useState, useEffect, useCallback } from "react";
import { sectionApi } from "../../OwnerCourses/api/sectionApi";

export const useCourseSections = (courseId) => {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(!!courseId);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!courseId) return;

      try {
        const data = await sectionApi.getSections(courseId);

        if (isMounted) {
          const sortedSections = (data || []).sort((a, b) => a.order - b.order);
          setSections(sortedSections);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load course sections.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const refetch = useCallback(async () => {
    if (!courseId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await sectionApi.getSections(courseId);
      const sortedSections = (data || []).sort((a, b) => a.order - b.order);
      setSections(sortedSections);
    } catch (err) {
      setError(err.message || "Failed to load course sections.");
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  return {
    sections,
    isLoading,
    error,
    refetch,
  };
};
