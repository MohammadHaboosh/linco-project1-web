import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { libraryApi } from "../api/libraryApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useTags = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [tagsError, setTagsError] = useState(null);

  const fetchTags = useCallback(async () => {
    setIsLoadingTags(true);
    setTagsError(null);
    try {
      const data = await libraryApi.getAllTags();
      setTags(data || []);
    } catch (requestError) {
      setTagsError(
        getApiErrorMessage(requestError, t("course-tags-load-failed")),
      );
    } finally {
      setIsLoadingTags(false);
    }
  }, [t]);

  useEffect(() => {
    let isMounted = true;

    const loadTags = async () => {
      setIsLoadingTags(true);
      setTagsError(null);
      try {
        const data = await libraryApi.getAllTags();
        if (isMounted) {
          setTags(data || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setTagsError(
            getApiErrorMessage(
              requestError,
              t("course-tags-load-failed"),
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingTags(false);
        }
      }
    };

    loadTags();

    return () => {
      isMounted = false;
    };
  }, [t]);

  return {
    tags,
    isLoadingTags,
    tagsError,
    refetchTags: fetchTags,
  };
};
