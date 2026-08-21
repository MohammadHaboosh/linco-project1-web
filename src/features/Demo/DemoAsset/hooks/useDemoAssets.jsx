import { useState, useEffect } from "react";
import { ownerCoursesApi } from "../../OwnerCourses/api/ownerCoursesApi";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useDemoAssets = (demoId) => {
  const { t } = useTranslation();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(demoId));
  const [error, setError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!demoId) {
      return undefined;
    }
    let isCurrent = true;

    const fetchAssets = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await ownerCoursesApi.getDemoAssets(demoId);
        if (isCurrent) setAssets(data || []);
      } catch (err) {
        console.error("Error fetching demo assets:", err);
        if (isCurrent) {
          setAssets([]);
          setError(
            getApiErrorMessage(err, t("assets-load-error-message")),
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchAssets();

    return () => {
      isCurrent = false;
    };
  }, [demoId, reloadVersion, t]);

  return {
    assets,
    isLoading,
    error,
    retry: () => setReloadVersion((version) => version + 1),
  };
};
