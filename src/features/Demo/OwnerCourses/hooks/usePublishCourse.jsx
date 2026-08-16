import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ownerCoursesApi } from "../api/ownerCoursesApi";

export const usePublishCourse = () => {
  const { t } = useTranslation();
  const [isPublishing, setIsPublishing] = useState(false);

  const publishCourse = async (courseId) => {
    setIsPublishing(true);
    try {
      const res = await ownerCoursesApi.publishCourse(courseId);
      return { success: true, data: res };
    } catch {
      return { success: false, error: t("course-publish-failed") };
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    publishCourse,
    isPublishing,
  };
};
