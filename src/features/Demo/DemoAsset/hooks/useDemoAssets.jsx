import { useState, useEffect } from "react";
import { ownerCoursesApi } from "../../OwnerCourses/api/ownerCoursesApi";

export const useDemoAssets = (demoId) => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(demoId));
  const [error, setError] = useState(false);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!demoId) {
      return undefined;
    }
    let isCurrent = true;

    const fetchAssets = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const data = await ownerCoursesApi.getDemoAssets(demoId);
        if (isCurrent) setAssets(data || []);
      } catch (err) {
        console.error("Error fetching demo assets:", err);
        if (isCurrent) {
          setAssets([]);
          setError(true);
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchAssets();

    return () => {
      isCurrent = false;
    };
  }, [demoId, reloadVersion]);

  return {
    assets,
    isLoading,
    error,
    retry: () => setReloadVersion((version) => version + 1),
  };
};
