import { useState, useEffect, useCallback } from "react";
import { libraryApi } from "../api/libraryApi";

export const usePublicCourses = (demoId) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(demoId));
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    if (!demoId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await libraryApi.getCourses(demoId);
      setCourses(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch public courses");
    } finally {
      setIsLoading(false);
    }
  }, [demoId]);

  useEffect(() => {
    if (!demoId) return;

    let isMounted = true;

    const loadCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await libraryApi.getCourses(demoId);
        if (isMounted) {
          setCourses(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch public courses");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [demoId]);

  return {
    courses: demoId ? courses : [],
    isLoading: Boolean(demoId) && isLoading,
    error: demoId ? error : null,
    refetch: fetchCourses,
  };
};
