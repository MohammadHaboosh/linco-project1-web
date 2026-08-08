import { apiFetch } from "../../../../api/apiFetch";

const SUPPORTED_PLANS = new Set(["FREE", "STARTER", "PRO", "ENTERPRISE"]);

export const demoPlanApi = {
  createCheckoutSession: async ({ demoId, plan }) => {
    if (!demoId) {
      throw new Error("Demo ID is required to start checkout.");
    }

    const normalizedPlan = String(plan || "").trim().toUpperCase();
    if (!SUPPORTED_PLANS.has(normalizedPlan)) {
      throw new Error("A valid Demo plan is required.");
    }

    const response = await apiFetch("/payments/checkout/demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-demo-id": demoId,
      },
      body: JSON.stringify({ plan: normalizedPlan }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.success === false) {
      throw new Error(payload.message || "Unable to start checkout.");
    }

    const checkoutUrl = payload.data?.url;
    if (!checkoutUrl) {
      throw new Error("The checkout response did not include a URL.");
    }

    let parsedCheckoutUrl;
    try {
      parsedCheckoutUrl = new URL(checkoutUrl);
    } catch {
      throw new Error("The checkout response included an invalid URL.");
    }

    if (parsedCheckoutUrl.protocol !== "https:") {
      throw new Error("The checkout URL must use a secure connection.");
    }

    return parsedCheckoutUrl.toString();
  },
};
