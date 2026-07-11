import { apiFetch } from "../../../api/apiFetch";

export const fetchCurrentUser = async () => {
  const response = await apiFetch("/user/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching profile: ${response.statusText}`);
  }

  return response.json();
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiFetch("/authentication/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        "Failed to update password. Please check your current password.",
    );
  }

  return response.json().catch(() => ({}));
};

export const generate2FA = async () => {
  const response = await apiFetch("/authentication/2fa/generate", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to generate QR code.");
  }

  return response.json();
};

export const turnOn2FA = async (code) => {
  const response = await apiFetch("/authentication/2fa/turn-on", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify({ 
      "tfaCode": code
     }), 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to verify and enable 2FA.");
  }

  return response.json();
};
