import { useState, useEffect } from "react";
import { apiFetch } from "../../../../api/apiFetch";

export const useSectionLessons = (sectionId, isExpanded) => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // 💡 لمنع الجلب المتكرر لنفس القسم

  useEffect(() => {
    if (!sectionId || !isExpanded || hasFetched) return;

    let isMounted = true;

    const fetchLessons = async () => {
      try {
        await Promise.resolve();

        if (isMounted) setIsLoading(true);

        const response = await apiFetch(
          `/sections/${sectionId}/lessons/cursor`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch lessons");
        }

        if (isMounted) {
          const sortedLessons = (data.data || []).sort(
            (a, b) => a.order - b.order,
          );
          setLessons(sortedLessons);
          setHasFetched(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load lessons.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLessons();

    return () => {
      isMounted = false;
    };
  }, [sectionId, isExpanded, hasFetched]);

  return { lessons, isLoading, error };
};
