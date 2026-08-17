import { useCallback, useState, useEffect } from "react";
import { DepartmentCoursesApi } from "../api/DepartmentCoursesApi";

export const useDepartmentCourses = (demoId, departmentId) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(demoId && departmentId));
  const [error, setError] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [deleteError, setDeleteError] = useState(false);
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

  const deleteCourse = useCallback(
    async (courseId) => {
      if (!demoId || !departmentId || !courseId || deletingCourseId) {
        return false;
      }

      setDeletingCourseId(courseId);
      setDeleteError(false);

      try {
        await DepartmentCoursesApi.deleteDepartmentCourse(
          demoId,
          departmentId,
          courseId,
        );
        setCourses((currentCourses) =>
          currentCourses.filter(
            (item) =>
              String(item?.asset?.course?.id) !== String(courseId),
          ),
        );
        return true;
      } catch (deleteRequestError) {
        console.error(
          "Error deleting course from department:",
          deleteRequestError,
        );
        setDeleteError(true);
        return false;
      } finally {
        setDeletingCourseId(null);
      }
    },
    [demoId, departmentId, deletingCourseId],
  );

  return {
    courses,
    isLoading,
    error,
    deletingCourseId,
    deleteError,
    deleteCourse,
    retry: () => setReloadVersion((version) => version + 1),
  };
};
