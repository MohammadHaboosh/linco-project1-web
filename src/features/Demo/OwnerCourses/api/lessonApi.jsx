import { apiFetch } from "../../../../api/apiFetch";

export const lessonApi = {
  getLessons: async (sectionId) => {
    const response = await apiFetch(`/sections/${sectionId}/lessons/cursor`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    return data.data;
  },

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
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to get video upload URL");
    }

    return data.data;
  },

  uploadVideoToStorage: (uploadUrl, videoFile, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded * 100) / event.total,
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          reject(
            new Error(`Failed to upload video file (Status: ${xhr.status})`),
          );
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Failed to upload video file to storage server"));
      });

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
      xhr.setRequestHeader(
        "Content-Type",
        videoFile.type || "application/octet-stream",
      );

      xhr.send(videoFile);
    });
  },

  createLesson: async (sectionId, lessonPayload) => {
    const response = await apiFetch(`/sections/${sectionId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonPayload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create lesson");
    }

    return data.data;
  },
};
