import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { demoPlanApi } from "../api/demoPlanApi";

export const useDemoPlanCheckout = (demoId) => {
  const { t } = useTranslation();
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
      } catch {
        setCheckoutError(t("checkout-start-failed"));
        setCheckoutPlan(null);
        return false;
      }
    },
    [checkoutPlan, demoId, t],
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
