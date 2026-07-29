import { apiFetch } from "../../../../api/apiFetch";

export const courseManagerApi = {
  getAsset: async (demoId, assetId) => {
    const response = await apiFetch(`/assets/${assetId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-demo-id": demoId,
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Fetched Asset Details:", data.data);
    return data.data;
  },

  getCourseUploadUrl: async (fileName) => {
    const response = await apiFetch("/courses/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Fetched Course Upload URL:", data.data);
    return data.data;
  },

  uploadImageToStorage: async (uploadUrl, file) => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to storage service.");
    }
    return true;
  },

  updateCourseGeneralInfo: async (courseId, payload) => {
    const response = await apiFetch(`/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message);

    console.log("Updated Course General Info:", data.data);
    return data.data;
  },

  uploadAndSaveCourseImage: async (courseId, file, currentPayload) => {
    const { uploadUrl, fileKey } = await courseManagerApi.getCourseUploadUrl(
      file.name,
    );

    await courseManagerApi.uploadImageToStorage(uploadUrl, file);

    return await courseManagerApi.updateCourseGeneralInfo(courseId, {
      ...currentPayload,
      imagePath: fileKey,
    });
  },
};
