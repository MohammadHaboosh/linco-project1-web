import { API_BASE_URL } from "../config/apiConfig";
import { clearUser } from "../features/User/store/userSlice";
import i18n from "../i18n";
import { store } from "../store/Store";

let refreshPromise = null;
let isRedirectingToSignin = false;

class RefreshTokenError extends Error {
  constructor(message, sessionExpired = false) {
    super(message);
    this.name = "RefreshTokenError";
    this.sessionExpired = sessionExpired;
  }
}

const readErrorMessage = async (response, fallbackMessage) => {
  const payload = await response.clone().json().catch(() => ({}));
  const backendMessage =
    typeof payload?.message === "string" ? payload.message.trim() : "";

  return backendMessage || fallbackMessage;
};

export const getApiLanguage = () => {
  const language = i18n.resolvedLanguage || i18n.language || "en";
  return language.toLowerCase().split("-")[0] === "ar" ? "ar" : "en";
};

export const createApiHeaders = (initialHeaders) => {
  const headers = new Headers(initialHeaders);

  if (!headers.has("x-client-type")) {
    headers.set("x-client-type", "web");
  }

  headers.set("accept-language", getApiLanguage());

  return headers;
};

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/authentication/refresh-tokens`, {
      method: "POST",
      headers: createApiHeaders({
        "Content-Type": "application/json",
      }),
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          const sessionExpired = [400, 401, 403].includes(response.status);
          throw new RefreshTokenError(
            await readErrorMessage(
              response,
              "Failed to refresh the access token",
            ),
            sessionExpired,
          );
        }
      })
      .catch((error) => {
        if (error instanceof RefreshTokenError) {
          throw error;
        }

        throw new RefreshTokenError("Unable to refresh the access token");
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const endSession = (redirectOnAuthFailure) => {
  store.dispatch(clearUser());

  if (
    redirectOnAuthFailure &&
    !isRedirectingToSignin &&
    window.location.pathname !== "/signin"
  ) {
    isRedirectingToSignin = true;
    window.location.assign("/signin");
  }
};

export const apiFetch = async (
  path,
  options = {},
  { redirectOnAuthFailure = true } = {},
) => {
  const headers = createApiHeaders(options.headers);

  const requestOptions = {
    ...options,
    headers,
    credentials: "include",
  };

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  let response = await fetch(url, requestOptions);

  if (response.status !== 401) {
    return response;
  }

  try {
    await refreshAccessToken();
  } catch (error) {
    if (!error.sessionExpired) {
      throw error;
    }

    endSession(redirectOnAuthFailure);

    if (!redirectOnAuthFailure) {
      return response;
    }

    throw new Error(error.message, {
      cause: error,
    });
  }

  response = await fetch(url, requestOptions);

  if (response.status === 401) {
    endSession(redirectOnAuthFailure);

    if (redirectOnAuthFailure) {
      throw new Error(
        await readErrorMessage(
          response,
          "Your session has expired. Please sign in again.",
        ),
      );
    }
  }

  return response;
};
