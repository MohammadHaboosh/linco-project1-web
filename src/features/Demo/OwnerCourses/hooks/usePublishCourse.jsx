import { useState } from "react";
import { ownerCoursesApi } from "../api/ownerCoursesApi";

export const usePublishCourse = () => {
  const [isPublishing, setIsPublishing] = useState(false);

  const publishCourse = async (courseId) => {
    setIsPublishing(true);
    try {
      const res = await ownerCoursesApi.publishCourse(courseId);
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err.message || "Something went wrong" };
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    publishCourse,
    isPublishing,
  };
};
