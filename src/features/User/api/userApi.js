import { apiFetch } from "../../../api/apiFetch";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUploadUrl = async (fileName) => {
  const response = await apiFetch("/users/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify({ fileName }),
  });

  if (!response.ok) throw new Error("Failed to generate upload URL");

  const data = await response.json();
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

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/authentication/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      imagePath: userData.imagePath,
      birthDate: userData.birthDate,
      email: userData.email,
      password: userData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Backend Error Response:", data);
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const signinUser = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
      },
      credentials: "include",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const err = new Error(
        data.message || `HTTP error! status: ${response.status}`,
      );
      err.code = data.error;
      throw err;
    }

    return data;
  } catch (error) {
    console.error("API Error during signin:", error);
    throw error;
  }
};

export const verify2FASignin = async (twoFactorToken, code) => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/sign-in/2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
      },
      credentials: "include",
      body: JSON.stringify({
        "twoFactorToken": twoFactorToken,
        "tfaCode" : code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error during 2FA verification:", error);
    throw error;
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await fetch(
      `${BASE_URL}/authentication/resend-verification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        body: JSON.stringify({ email }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error during resend verification:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error during signout:", error);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  const response = await apiFetch(
    "/users/me",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { redirectOnAuthFailure: false },
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data;
};

export const verifyUserEmail = async (token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/authentication/verify-email?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error during email verification:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error during password reset request:", error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
      },
      credentials: "include",
      body: JSON.stringify({
        password: newPassword,
        token: token,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error during password reset:", error);
    throw error;
  }
};
