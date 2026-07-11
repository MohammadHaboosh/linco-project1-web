import { API_BASE_URL } from "../config/apiConfig";
import { clearUser } from "../features/User/store/userSlice";
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

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/authentication/refresh-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-type": "web",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          const sessionExpired = [400, 401, 403].includes(response.status);
          throw new RefreshTokenError(
            "Failed to refresh the access token",
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
  const headers = new Headers(options.headers);

  if (!headers.has("x-client-type")) {
    headers.set("x-client-type", "web");
  }

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

    throw new Error("Your session has expired. Please sign in again.", {
      cause: error,
    });
  }

  response = await fetch(url, requestOptions);

  if (response.status === 401) {
    endSession(redirectOnAuthFailure);

    if (redirectOnAuthFailure) {
      throw new Error("Your session has expired. Please sign in again.");
    }
  }

  return response;
};
