import { apiFetch } from "../../../api/apiFetch";

export const fetchDemos = async () => {
  const response = await apiFetch("/demos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error("Failed to fetch demos");
  }

  return data;
};
