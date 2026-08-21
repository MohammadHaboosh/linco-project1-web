import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { libraryApi } from "../api/libraryApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const usePublicCourses = (demoId) => {
  const { t } = useTranslation();
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
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, t("public-courses-load-failed")),
      );
    } finally {
      setIsLoading(false);
    }
  }, [demoId, t]);

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
      } catch (requestError) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              requestError,
              t("public-courses-load-failed"),
            ),
          );
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
  }, [demoId, t]);

  return {
    courses: demoId ? courses : [],
    isLoading: Boolean(demoId) && isLoading,
    error: demoId ? error : null,
    refetch: fetchCourses,
  };
};
