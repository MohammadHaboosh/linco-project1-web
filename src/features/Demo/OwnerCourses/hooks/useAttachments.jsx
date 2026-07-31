import { useState, useCallback } from "react";
import { attachmentApi } from "../api/attachmentApi";

export const useAttachments = () => {
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttachments = useCallback(async (lessonId) => {
    if (!lessonId) return [];
    setIsLoading(true);
    setError(null);
    try {
      const data = await attachmentApi.getAttachments(lessonId);
      const formatted = (data || []).map((item) => ({
        id: item.id,
        title: item.name || item.title || "Attachment",
        fileName: item.name || item.fileName || "File",
        path: item.path,
        status: "uploaded",
        isExisting: true,
      }));
      setAttachments(formatted);
      return formatted;
    } catch (err) {
      console.error("Error fetching attachments:", err);
      setError(err.message || "Failed to load attachments");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadFilesToStorage = async (lessonId, fileList) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    const newTempItems = files.map((file, idx) => ({
      tempId: `temp-${Date.now()}-${idx}`,
      file,
      name: file.name,
      title: file.name,
      progress: 0,
      status: "uploading",
      uploadedPath: "",
      isNew: true,
    }));

    setAttachments((prev) => [...prev, ...newTempItems]);

    try {
      const fileNames = files.map((f) => f.name);
      const uploadUrlsData = await attachmentApi.getUploadUrl(
        lessonId,
        fileNames,
      );

      await Promise.all(
        newTempItems.map(async (tempItem) => {
          const uploadInfo = uploadUrlsData.find(
            (info) => info.fileName === tempItem.name,
          );

          if (!uploadInfo || !uploadInfo.uploadUrl) {
            setAttachments((prev) =>
              prev.map((item) =>
                item.tempId === tempItem.tempId
                  ? { ...item, status: "error" }
                  : item,
              ),
            );
            return;
          }

          try {
            await attachmentApi.uploadAttachmentToStorage(
              uploadInfo.uploadUrl,
              tempItem.file,
              (percent) => {
                setAttachments((prev) =>
                  prev.map((item) =>
                    item.tempId === tempItem.tempId
                      ? { ...item, progress: percent }
                      : item,
                  ),
                );
              },
            );

            const finalPath = uploadInfo.fileKey || uploadInfo.cdnUrl;

            setAttachments((prev) =>
              prev.map((item) =>
                item.tempId === tempItem.tempId
                  ? {
                      ...item,
                      progress: 100,
                      status: "uploaded",
                      uploadedPath: finalPath,
                    }
                  : item,
              ),
            );
          } catch (uploadErr) {
            console.error(`Error uploading file ${tempItem.name}:`, uploadErr);
            setAttachments((prev) =>
              prev.map((item) =>
                item.tempId === tempItem.tempId
                  ? { ...item, status: "error" }
                  : item,
              ),
            );
          }
        }),
      );
    } catch (err) {
      console.error("Error getting upload URLs:", err);
      setError("Failed to request upload URLs");
    }
  };

  const saveAttachments = async (lessonId, itemsToSave = attachments) => {
    if (!lessonId) return;
    setIsSaving(true);
    setError(null);

    try {
      const unsavedNewItems = itemsToSave.filter(
        (item) => item.isNew && item.file,
      );

      if (unsavedNewItems.length === 0) {
        setIsSaving(false);
        return;
      }

      const fileNames = unsavedNewItems.map((item) => item.file.name);
      const uploadUrlsData = await attachmentApi.getUploadUrl(
        lessonId,
        fileNames,
      );

      const createdResults = await Promise.all(
        unsavedNewItems.map(async (item) => {
          const uploadInfo = uploadUrlsData.find(
            (info) => info.fileName === item.file.name,
          );

          const uploadUrl = uploadInfo?.uploadUrl || uploadInfo?.url;
          const finalPath =
            uploadInfo?.fileKey || uploadInfo?.cdnUrl || uploadInfo?.path || "";

          if (uploadUrl && item.file) {
            await attachmentApi.uploadAttachmentToStorage(uploadUrl, item.file);
          }

          const payload = {
            name: item.title || item.fileName || item.file.name,
            path: finalPath,
          };

          const response = await attachmentApi.createAttachment(
            lessonId,
            payload,
          );
          return { tempId: item.id || item.tempId, data: response };
        }),
      );

      setAttachments((prev) =>
        prev.map((item) => {
          const itemId = item.id || item.tempId;
          const matched = createdResults.find((r) => r.tempId === itemId);
          if (matched && matched.data) {
            return {
              id: matched.data.id,
              title: matched.data.name,
              fileName: matched.data.name,
              path: matched.data.path,
              status: "uploaded",
              isExisting: true,
              isNew: false,
            };
          }
          return item;
        }),
      );
    } catch (err) {
      console.error("Error saving attachments to DB:", err);
      setError(err.message || "Failed to save attachments");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    attachments,
    isLoading,
    isSaving,
    error,
    fetchAttachments,
    uploadFilesToStorage,
    saveAttachments,
    setAttachments,
  };
};
