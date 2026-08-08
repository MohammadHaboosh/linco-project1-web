import { useCallback, useState } from "react";
import { demoPlanApi } from "../api/demoPlanApi";

export const useDemoPlanCheckout = (demoId) => {
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  const startCheckout = useCallback(
    async (plan) => {
      if (checkoutPlan) return false;

      setCheckoutPlan(plan);
      setCheckoutError("");

      try {
        const checkoutUrl = await demoPlanApi.createCheckoutSession({
          demoId,
          plan,
        });

        window.location.assign(checkoutUrl);
        return true;
      } catch (error) {
        setCheckoutError(error.message || "Unable to start checkout.");
        setCheckoutPlan(null);
        return false;
      }
    },
    [checkoutPlan, demoId],
  );

  const clearCheckoutError = useCallback(() => setCheckoutError(""), []);

  return {
    checkoutPlan,
    checkoutError,
    isStartingCheckout: Boolean(checkoutPlan),
    startCheckout,
    clearCheckoutError,
  };
};
