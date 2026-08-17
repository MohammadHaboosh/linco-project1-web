import { apiFetch } from "../../../api/apiFetch";

export const getUploadUrl = async (fileName) => {
  const response = await apiFetch("/demos/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify({ fileName }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Failed to generate upload URL");
  }

  return data;
};

export const getSignatureUploadUrl = async (fileName) => {
  const response = await apiFetch("/courses/signature-upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify({ fileName }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || "Failed to generate signature upload URL",
    );
  }

  return data;
};

export const uploadFileToCloud = async (uploadUrl, file) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to the cloud");
  }
};

export const createRoom = async ({
  name,
  imagePath,
  signatureImagePath,
  description,
}) => {
  const payload = {
    name,
    imagePath,
    signatureImagePath,
    description,
  };

  const hasMissingField = Object.values(payload).some(
    (value) => typeof value !== "string" || !value.trim(),
  );

  if (hasMissingField) {
    throw new Error("Name, logo, signature, and description are required");
  }

  const response = await apiFetch("/demos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok || responseData.success === false) {
    throw new Error(responseData.message || "Failed to create the room");
  }

  return responseData;
};
