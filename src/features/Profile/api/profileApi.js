import { apiFetch } from "../../../api/apiFetch";

export const fetchCurrentUser = async () => {
  const response = await apiFetch("/user/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || `Error fetching profile: ${response.statusText}`,
    );
  }

  return data;
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
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message ||
        "Failed to update password. Please check your current password.",
    );
  }

  return data;
};

export const generate2FA = async () => {
  const response = await apiFetch("/authentication/2fa/generate", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Failed to generate QR code.");
  }

  return data;
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
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Failed to verify and enable 2FA.");
  }

  return data;
};
