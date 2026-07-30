import { apiFetch } from "../../../../api/apiFetch";

export const lessonApi = {
  getUploadUrl: async (sectionId, fileName) => {
    const response = await apiFetch(
      `/sections/${sectionId}/lessons/upload-url`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      },
    );

    const data = await response.json();
    console.log("Fetched Video Upload URL Data:", data.data);
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to get video upload URL");
    }

    return data.data;
  },

  uploadVideoToStorage: async (uploadUrl, videoFile) => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": videoFile.type || "application/octet-stream",
      },
      body: videoFile,
    });

    if (!response.ok) {
      throw new Error("Failed to upload video file to storage server");
    }
    console.log("Video file successfully uploaded to Azure Blob Storage");
    return true;
  },

  createLesson: async (sectionId, lessonPayload) => {
    const response = await apiFetch(`/sections/${sectionId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonPayload),
    });

    const data = await response.json();
    console.log("Created Lesson:", data.data);
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create lesson");
    }

    return data.data;
  },
};
