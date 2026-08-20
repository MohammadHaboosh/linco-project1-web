import { apiFetch, createApiHeaders } from "../../../api/apiFetch";
import i18n from "../../../i18n";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const createResponseError = (data, response, fallbackKey) => {
  const error = new Error(data.message || i18n.t(fallbackKey));
  error.code = data.error || data.code;
  error.status = response.status;
  return error;
};

export const getUploadUrl = async (fileName) => {
  const response = await apiFetch("/users/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify({ fileName }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw createResponseError(data, response, "auth-upload-url-failed");
  }

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
    throw new Error(i18n.t("auth-upload-image-failed"));
  }
};

export const updateUserProfilePhoto = async (userId, imagePath) => {
  const response = await apiFetch(`/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "web",
    },
    body: JSON.stringify({ imagePath }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw createResponseError(data, response, "auth-update-profile-photo-failed");
  }

  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/authentication/sign-up`, {
    method: "POST",
    headers: createApiHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      imagePath: userData.imagePath,
      birthDate: userData.birthDate,
      email: userData.email,
      password: userData.password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    console.error("Backend Error Response:", data);
    throw createResponseError(data, response, "auth-signup-failed");
  }

  return data;
};

export const signinUser = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/sign-in`, {
      method: "POST",
      headers: createApiHeaders({
        "Content-Type": "application/json",
      }),
      credentials: "include",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw createResponseError(data, response, "auth-signin-failed");
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
      headers: createApiHeaders({
        "Content-Type": "application/json",
      }),
      credentials: "include",
      body: JSON.stringify({
        "twoFactorToken": twoFactorToken,
        "tfaCode" : code,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw createResponseError(
        data,
        response,
        "auth-two-factor-verification-failed",
      );
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
        headers: createApiHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ email }),
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw createResponseError(data, response, "auth-resend-email-failed");
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
      headers: createApiHeaders({
        "Content-Type": "application/json",
      }),
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw createResponseError(data, response, "auth-signout-failed");
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
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) return null;

  if (!response.ok || data.success === false) {
    throw createResponseError(data, response, "auth-current-user-failed");
  }

  return data;
};

export const verifyUserEmail = async (token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/authentication/verify-email?token=${token}`,
      {
        method: "GET",
        headers: createApiHeaders({
          "Content-Type": "application/json",
        }),
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw createResponseError(data, response, "auth-account-verification-failed");
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
      headers: createApiHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw createResponseError(data, response, "auth-reset-link-failed");
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
      headers: createApiHeaders({
        "Content-Type": "application/json",
      }),
      credentials: "include",
      body: JSON.stringify({
        password: newPassword,
        token: token,
      }),
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok || data.success === false) {
      throw createResponseError(data, response, "auth-reset-password-failed");
    }

    return data;
  } catch (error) {
    console.error("API Error during password reset:", error);
    throw error;
  }
};
