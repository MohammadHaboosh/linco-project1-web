import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { departmentApi } from "../features/Demo/HomeDemoPage/api/departmentApi";
import { useDemo } from "./useDemo";

export const useDepartmentNavigation = (fallbackName = "Departments") => {
  const { demoId } = useDemo();
  const { departmentId } = useParams();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Failed to load departments:", error);
        if (isMounted) {
          setDepartments([]);
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
      return fallbackName;
    }

    const matchedDepartment = departments.find(
      (dept) => String(dept.id) === String(departmentId),
    );

    if (!matchedDepartment || matchedDepartment.isLocked) {
      return fallbackName;
    }

    return matchedDepartment.title || matchedDepartment.name || fallbackName;
  }, [departments, departmentId, fallbackName]);

  return {
    departments: accessibleDepartments,
    isLoading,
    selectedDepartmentName,
  };
};
