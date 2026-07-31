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

    console.log("Fetched Course Upload URL Data:", data.data);
    return data.data;
  },

  uploadImageToStorage: async (uploadUrl, file) => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to storage service.");
    }
    console.log(" Image successfully uploaded to Azure Blob Storage");
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
    console.log(" Starting Full Image Upload & Save Flow for:", file.name);

    const uploadData = await courseManagerApi.getCourseUploadUrl(file.name);
    const uploadUrl = uploadData.uploadUrl;

    const fullCdnUrl =
      uploadData.cdnUrl || uploadData.fileKey || uploadData.key;

    console.log("Target Upload URL:", uploadUrl);
    console.log("Full CDN Image URL to be stored:", fullCdnUrl);

    await courseManagerApi.uploadImageToStorage(uploadUrl, file);

    const { imageFile, imagePreview, ...cleanPayload } = currentPayload || {};

    const updatedPayload = {
      ...cleanPayload,
      imagePath: fullCdnUrl,
    };

    console.log(" Sending Final Course Payload:", updatedPayload);
    return await courseManagerApi.updateCourseGeneralInfo(
      courseId,
      updatedPayload,
    );
  },
};
