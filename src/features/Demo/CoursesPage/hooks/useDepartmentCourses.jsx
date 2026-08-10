import { useState, useEffect } from "react";
import { DepartmentCoursesApi } from "../api/DepartmentCoursesApi";

export const useDepartmentCourses = (demoId, departmentId) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!demoId || !departmentId) return;

    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await DepartmentCoursesApi.getDepartmentCourse(
          demoId,
          departmentId,
        );
        setCourses(response.data || []);
      } catch (err) {
        console.error("Error fetching department courses:", err);
        setError(err.message || "Error fetching department courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [demoId, departmentId]);

  return { courses, isLoading, error };
};
