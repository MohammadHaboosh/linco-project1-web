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
        const tagIds = [];
        if (courseData.tags && courseData.tags.length > 0) {
          const tagPromises = courseData.tags.map((tag) =>
            publishCourseApi.createTag(
              typeof tag === "string" ? tag : tag.name || tag.text,
            ),
          );
          const createdTags = await Promise.all(tagPromises);
          tagIds.push(...createdTags.map((t) => t.id));
        }

        const payload = {
          title: courseData.title,
          visibility: courseData.privacy
            ? courseData.privacy.toUpperCase()
            : "PRIVATE",
          description: courseData.description,
          imagePath: courseData.thumbnail ? "uploaded-image-path" : "default",
          demoId: demoId,
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
