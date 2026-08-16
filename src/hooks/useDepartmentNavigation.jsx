import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { departmentApi } from "../features/Demo/HomeDemoPage/api/departmentApi";
import { useDemo } from "./useDemo";
import { useTranslation } from "react-i18next";

export const useDepartmentNavigation = (fallbackName) => {
  const { t } = useTranslation();
  const { demoId } = useDemo();
  const { departmentId } = useParams();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const resolvedFallbackName = fallbackName || t("departments");

  useEffect(() => {
    let isMounted = true;

    const loadDepartments = async () => {
      if (!demoId) {
        if (isMounted) {
          setDepartments([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const data = await departmentApi.getDepartments(demoId);

        if (!isMounted) return;

        setDepartments(data || []);
        setError(false);
      } catch (error) {
        console.error("Failed to load departments:", error);
        if (isMounted) {
          setDepartments([]);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDepartments();

    return () => {
      isMounted = false;
    };
  }, [demoId]);

  const accessibleDepartments = useMemo(() => {
    return (departments || []).filter((dept) => !dept.isLocked);
  }, [departments]);

  const selectedDepartmentName = useMemo(() => {
    if (!departments.length) {
      return resolvedFallbackName;
    }

    const matchedDepartment = departments.find(
      (dept) => String(dept.id) === String(departmentId),
    );

    if (!matchedDepartment || matchedDepartment.isLocked) {
      return resolvedFallbackName;
    }

    return (
      matchedDepartment.title || matchedDepartment.name || resolvedFallbackName
    );
  }, [departments, departmentId, resolvedFallbackName]);

  return {
    departments: accessibleDepartments,
    isLoading,
    error,
    selectedDepartmentName,
  };
};
