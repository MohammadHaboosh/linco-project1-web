const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchDemos = async () => {
  const response = await fetch(`${BASE_URL}/demos`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log("Fetched demos:", data);

  if (!response.ok) {
    throw new Error("Failed to fetch demos");
  }

  return data;
};
