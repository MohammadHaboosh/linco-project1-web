import { useState, useEffect, useCallback } from "react";
import { departmentApi } from "../api/departmentApi";

export const useDepartments = (demoId) => {
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
          setDepartments(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "An error occurred while loading departments.",
          );
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
  }, [demoId]);

  const refetch = useCallback(async () => {
    if (!demoId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await departmentApi.getDepartments(demoId);
      setDepartments(data);
    } catch (err) {
      setError(err.message || "An error occurred while reloading departments.");
    } finally {
      setIsLoading(false);
    }
  }, [demoId]);

  return {
    departments,
    isLoading,
    error,
    refetch,
  };
};
