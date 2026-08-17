import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { departmentApi } from "../api/departmentApi";

export const useDepartments = (demoId) => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(!!demoId);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!demoId) return;

    const loadInitialData = async () => {
      try {
        const data = await departmentApi.getDepartments(demoId);
        if (isMounted) {
          const onlyDepartments = data.filter((item) => item.isGroup !== true);
          setDepartments(onlyDepartments);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError(t("departments-load-error-message"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
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
      const data = await departmentApi.getDepartments(demoId);
      const onlyDepartments = data.filter((item) => item.isGroup !== true);
      setDepartments(onlyDepartments);
    } catch {
      setError(t("departments-load-error-message"));
    } finally {
      setIsLoading(false);
    }
  }, [demoId, t]);

  return {
    departments,
    isLoading,
    error,
    refetch,
  };
};
