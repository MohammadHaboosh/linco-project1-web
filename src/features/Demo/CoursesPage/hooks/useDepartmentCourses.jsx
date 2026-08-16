import { useState, useEffect } from "react";
import { DepartmentCoursesApi } from "../api/DepartmentCoursesApi";

export const useDepartmentCourses = (demoId, departmentId) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(demoId && departmentId));
  const [error, setError] = useState(false);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!demoId || !departmentId) {
      return undefined;
    }
    let isCurrent = true;

    const fetchCourses = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const response = await DepartmentCoursesApi.getDepartmentCourse(
          demoId,
          departmentId,
        );
        if (isCurrent) setCourses(response.data || []);
      } catch (err) {
        console.error("Error fetching department courses:", err);
        if (isCurrent) {
          setCourses([]);
          setError(true);
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchCourses();

    return () => {
      isCurrent = false;
    };
  }, [demoId, departmentId, reloadVersion]);

  return {
    courses,
    isLoading,
    error,
    retry: () => setReloadVersion((version) => version + 1),
  };
};
