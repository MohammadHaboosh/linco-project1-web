export const fetchCurrentUser = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${BASE_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth logic
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching profile: ${response.statusText}`);
  }

  return response.json();
};
