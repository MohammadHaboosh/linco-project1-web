import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ownerCoursesApi } from "../api/ownerCoursesApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

const mapAssetToCourse = (asset) => {
  const c = asset.course;

  return {
    assetId: asset.id,
    accessMethod: asset.accessMethod,
    id: c.id,
    title: c.title,
    description: c.description,
    isPublished: c.isPublished,
    tags: c.tags ? c.tags.map((t) => t.name) : [],
    sectionsCount: c.sectionsCount || 0,
    lessonCount: c.lessonCount || 0,
    imagePath: c.imagePath,
    price: c.price || 0,
    visibility: c.visibility || "PUBLIC",
  };
};

export const useOwnerCourses = (demoId) => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(!!demoId);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!demoId) return;

    const loadInitialData = async () => {
      try {
        const assetsData = await ownerCoursesApi.getDemoAssets(demoId);
        const formattedCourses = assetsData.map(mapAssetToCourse);

        if (isMounted) {
          setCourses(formattedCourses);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            getApiErrorMessage(err, t("courses-load-error-message")),
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [demoId, t]);

  const refetch = useCallback(async () => {
    if (!demoId) return;
    setIsLoading(true);
    setError(null);

    try {
      const assetsData = await ownerCoursesApi.getDemoAssets(demoId);
      setCourses(assetsData.map(mapAssetToCourse));
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, t("courses-load-error-message")),
      );
    } finally {
      setIsLoading(false);
    }
  }, [demoId, t]);

  return {
    courses,
    isLoading,
    error,
    refetch,
  };
};
