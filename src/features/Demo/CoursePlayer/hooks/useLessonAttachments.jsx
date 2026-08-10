import { useState, useEffect } from "react";
import { attachmentApi } from "../../OwnerCourses/api/attachmentApi";

export const useLessonAttachments = (lessonId) => {
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAttachments = async () => {
      await Promise.resolve();

      if (!lessonId || String(lessonId).startsWith("temp_")) {
        if (isMounted) setAttachments([]);
        return;
      }

      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const data = await attachmentApi.getAttachments(lessonId);

        if (isMounted) {
          setAttachments(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load attachments.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAttachments();

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  return { attachments, isLoading, error };
};
