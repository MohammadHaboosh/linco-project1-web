import { useState } from "react";
import { publishCourseApi } from "../api/publishCourseApi";
import { courseManagerApi } from "../../OwnerCourses/api/courseManagerApi";

export const useCreateCourse = (demoId) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createCourse = async (courseData) => {
    setIsCreating(true);
    setError(null);

    try {
      const activeDemoId = demoId || courseData?.demoId;

      if (!activeDemoId) {
        throw new Error(
          "Missing demoId: Cannot create course without a valid demoId.",
        );
      }

      let tagIds = [];
      if (courseData.tags && courseData.tags.length > 0) {
        tagIds = courseData.tags.map((tag) => tag.id).filter(Boolean);
      }

      const basePayload = {
        title: courseData.title,
        description: courseData.description,
        imagePath: courseData.imagePath || "default",
        visibility: courseData.visibility || "PRIVATE",
        price: Number(courseData.price) || 0,
        tagIds: tagIds,
        demoId: activeDemoId,
      };

      const createdCourseRes = await publishCourseApi.createCourse(basePayload);

      const courseId =
        createdCourseRes?.id ||
        createdCourseRes?.data?.id ||
        createdCourseRes?.course?.id;

      if (!courseId) {
        throw new Error("Failed to retrieve course ID after creation.");
      }

      let finalImagePath = courseData.imagePath;

      if (courseData.imageFile) {
        console.log(
          "[useCreateCourse] Uploading image for created course:",
          courseId,
        );
        const imageResult = await courseManagerApi.uploadAndSaveCourseImage(
          courseId,
          courseData.imageFile,
          basePayload,
        );

        finalImagePath =
          imageResult?.imagePath ||
          imageResult?.data?.imagePath ||
          finalImagePath;
      }

      return {
        ...createdCourseRes,
        id: courseId,
        imagePath: finalImagePath,
      };
    } catch (err) {
      console.error("Error creating course with image upload:", err);
      setError(err.message || "Failed to create course");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { createCourse, isCreating, error };
};
