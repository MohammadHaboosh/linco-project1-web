export const fetchCurrentUser = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${BASE_URL}/user/me`, {
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web", 
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error fetching profile: ${response.statusText}`);
  }

  return response.json();
};

export const changePassword = async (oldPassword, newPassword) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${BASE_URL}/authentication/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web", 
    },
    credentials: "include",
    body: JSON.stringify({
      oldPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update password. Please check your current password.");
  }

  return response.json().catch(() => ({}));
};