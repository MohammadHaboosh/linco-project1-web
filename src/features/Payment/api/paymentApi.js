import { apiFetch } from "../../../api/apiFetch";

export const paymentApi = {
  getCheckoutStatus: async (sessionId, options = {}) => {
    const normalizedSessionId = String(sessionId || "").trim();
    if (!normalizedSessionId) {
      throw new Error("A checkout session ID is required.");
    }

    // Browsers do not support request bodies on GET requests, so the session
    // identifier is sent as a query parameter.
    const query = new URLSearchParams({ session_id: normalizedSessionId });
    const response = await apiFetch(
      `/payments/checkout/status?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: options.signal,
      },
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.success === false) {
      throw new Error(payload.message || "Unable to verify the payment.");
    }

    if (!payload.data || typeof payload.data !== "object") {
      throw new Error("The payment status response is invalid.");
    }

    return payload.data;
  },
};
