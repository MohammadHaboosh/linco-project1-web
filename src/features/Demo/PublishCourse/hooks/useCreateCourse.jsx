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
        const activeDemoId = demoId || courseData?.demoId;

        if (!activeDemoId) {
          throw new Error(
            "Missing demoId: Cannot create course without a valid demoId.",
          );
        }

        let tagIds = [];
        if (courseData.tags && courseData.tags?.length > 0) {
          const tagIdResults = await Promise.all(
            courseData.tags.map(async (tag) => {
              if (typeof tag === "object" && tag !== null && tag.id) {
                return tag.id;
              }

              const tagName =
                typeof tag === "string"
                  ? tag
                  : tag?.name || tag?.label || tag?.value || "";

              if (!tagName || !tagName.trim()) return null;

              const res = await publishCourseApi.createTag(tagName.trim());
              return res.data?.id || res.id;
            }),
          );

          tagIds = tagIdResults.filter(Boolean);
        }

        const payload = {
          title: courseData.title,
          visibility: courseData.privacy
            ? courseData.privacy.toUpperCase()
            : "PRIVATE",
          description: courseData.description,
          imagePath: courseData.imagePath || "default",
          demoId: String(activeDemoId),
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
