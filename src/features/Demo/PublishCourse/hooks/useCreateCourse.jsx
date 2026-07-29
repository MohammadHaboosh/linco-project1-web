import { useState, useCallback } from "react";
import { publishCourseApi } from "../api/publishCourseApi";

export const useCreateCourse = (demoId) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createCourse = useCallback(
    async (courseData) => {
      setIsCreating(true);
      setError(null);

      try {
        let tagIds = [];
        if (courseData.tags?.length > 0) {
          const createdTags = await Promise.all(
            courseData.tags.map((tagName) =>
              publishCourseApi.createTag(tagName),
            ),
          );
          tagIds = createdTags.map((tag) => tag.id);
        }

        const payload = {
          title: courseData.title,
          visibility: courseData.privacy
            ? courseData.privacy.toUpperCase()
            : "PRIVATE",
          description: courseData.description,
          imagePath: courseData.imagePath || "default",
          price: Number(courseData.price) || 0,
          tagIds: tagIds,
        };

        const newCourse = await publishCourseApi.createCourse(payload);
        return newCourse;
      } catch (err) {
        setError(err.message || "Failed to create course");
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [demoId],
  );

  return { createCourse, isCreating, error };
};
