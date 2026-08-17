import { apiFetch } from "../../../api/apiFetch";

export const fetchDemos = async () => {
  const response = await apiFetch("/demos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Failed to fetch demos");
  }

  return data;
};
