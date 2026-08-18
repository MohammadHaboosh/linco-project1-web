import { apiFetch } from "../../../../api/apiFetch";

export const attachmentApi = {
  getAttachments: async (lessonId) => {
    if (!lessonId || String(lessonId).startsWith("temp_")) {
      return [];
    }

    const response = await apiFetch(`/lessons/${lessonId}/attachments/cursor`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch attachments");
    }

    return data.data || [];
  },

  getUploadUrl: async (lessonId, fileNames) => {
    const response = await apiFetch(
      `/lessons/${lessonId}/attachments/upload-url`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: fileNames }),
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to get attachments upload URLs");
    }

    return data.data;
  },

  uploadAttachmentToStorage: (uploadUrl, file, onProgress) => {
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
            new Error(
              `Failed to upload attachment file (Status: ${xhr.status})`,
            ),
          );
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Failed to upload attachment file to storage server"));
      });

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
      xhr.setRequestHeader(
        "Content-Type",
        file.type || "application/octet-stream",
      );

      xhr.send(file);
    });
  },

  createAttachment: async (lessonId, attachmentPayload) => {
    const response = await apiFetch(`/lessons/${lessonId}/attachments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attachmentPayload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create attachment");
    }

    return data.data;
  },

  deleteAttachment: async (lessonId, attachmentId) => {
    const response = await apiFetch(
      `/lessons/${lessonId}/attachments/${attachmentId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete attachment");
    }

    return data.data;
  },
};
