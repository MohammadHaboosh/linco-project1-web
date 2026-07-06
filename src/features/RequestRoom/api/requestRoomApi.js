const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUploadUrl = async (fileName) => {
  const response = await fetch(`${BASE_URL}/demos/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    credentials: "include",
    body: JSON.stringify({ fileName }),
  });

  if (!response.ok) throw new Error("Failed to generate upload URL");
  return response.json();
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

export const createRoom = async (data) => {
  const response = await fetch(`${BASE_URL}/demos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    credentials: "include",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      imagePath: data.imagePath,
    }),
  });
  
  if (!response.ok) throw new Error("Failed to create the room");
  return response.json();
};
