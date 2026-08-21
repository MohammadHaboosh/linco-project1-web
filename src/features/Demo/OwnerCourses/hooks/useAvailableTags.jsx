import { useState, useEffect } from "react";
import { apiFetch } from "../../../../api/apiFetch";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useAvailableTags = (enabled = true) => {
  const { t } = useTranslation();
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(enabled);
  const [tagsError, setTagsError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;

    let isMounted = true;
    const controller = new AbortController();

    queueMicrotask(() => {
      if (isMounted) setIsLoadingTags(true);
    });

    const fetchTags = async () => {
      try {
        setTagsError("");
        const response = await apiFetch("/tags", {
          method: "GET",
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(
            payload.message || t("course-tags-load-failed"),
          );
        }

        if (isMounted) {
          setAvailableTags(payload.data || []);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch available tags:", error);
          if (isMounted) {
            setTagsError(
              getApiErrorMessage(error, t("course-tags-load-failed")),
            );
          }
        }
      } finally {
        if (isMounted) setIsLoadingTags(false);
      }
    };

    fetchTags();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [enabled, requestVersion, t]);

  return {
    availableTags,
    isLoadingTags,
    tagsError,
    retryTags: () => setRequestVersion((version) => version + 1),
  };
};
