import { useCallback, useState, useEffect } from "react";
import { DepartmentCoursesApi } from "../api/DepartmentCoursesApi";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useDepartmentCourses = (demoId, departmentId) => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(demoId && departmentId));
  const [error, setError] = useState("");
  const [deletingDepartmentCourseId, setDeletingDepartmentCourseId] =
    useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!demoId || !departmentId) {
      return undefined;
    }
    let isCurrent = true;

    const fetchCourses = async () => {
      setIsLoading(true);
      setError("");
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
          setError(
            getApiErrorMessage(err, t("courses-load-error-message")),
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchCourses();

    return () => {
      isCurrent = false;
    };
  }, [demoId, departmentId, reloadVersion, t]);

  const deleteCourse = useCallback(
    async (departmentCourseId) => {
      if (
        !demoId ||
        !departmentId ||
        !departmentCourseId ||
        deletingDepartmentCourseId
      ) {
        return false;
      }

      setDeletingDepartmentCourseId(departmentCourseId);
      setDeleteError("");

      try {
        await DepartmentCoursesApi.deleteDepartmentCourse(
          demoId,
          departmentId,
          departmentCourseId,
        );
        setCourses((currentCourses) =>
          currentCourses.filter(
            (item) => String(item?.id) !== String(departmentCourseId),
          ),
        );
        return true;
      } catch (deleteRequestError) {
        console.error(
          "Error deleting course from department:",
          deleteRequestError,
        );
        setDeleteError(
          getApiErrorMessage(
            deleteRequestError,
            t("department-course-delete-failed"),
          ),
        );
        return false;
      } finally {
        setDeletingDepartmentCourseId(null);
      }
    },
    [demoId, departmentId, deletingDepartmentCourseId, t],
  );

  return {
    courses,
    isLoading,
    error,
    deletingDepartmentCourseId,
    deleteError,
    deleteCourse,
    retry: () => setReloadVersion((version) => version + 1),
  };
};
