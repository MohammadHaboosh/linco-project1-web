import { useState, useEffect, useCallback } from "react";
// import { ownerCoursesApi } from "../api/ownerCoursesApi";

export const useCourseBuilder = (demoId) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(!!demoId);
  const [error, setError] = useState(null);
  const refetch = useCallback(async () => {
    if (!demoId) return;
    setIsLoading(true);
    setError(null);
  });

  return {
    courses,
    isLoading,
    error,
    refetch,
  };
};
