const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUploadUrl = async (fileName) => {
  console.log("fileName: ", fileName);
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

export const uploadFileToCloud = async (uploadUrl, fields, file) => {
  const cloudFormData = new FormData();

  Object.keys(fields).forEach((key) => {
    cloudFormData.append(key, fields[key]);
  });

  cloudFormData.append("file", file);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: cloudFormData,
  });

  if (!response.ok && response.status !== 204) {
    throw new Error("Failed to upload image to the cloud");
  }
};

export const createRoom = async (data) => {
  console.log("createRoom data: ", data);
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
      plan: data.plan,
    }),
  });
  const batata = await response.json();
  console.log("createRoom response: ", batata);
  if (!response.ok) throw new Error("Failed to create the room");
  return response.json();
};
