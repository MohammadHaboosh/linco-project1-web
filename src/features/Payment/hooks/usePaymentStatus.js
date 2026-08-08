import { useCallback, useEffect, useState } from "react";
import { paymentApi } from "../api/paymentApi";

const getVerificationState = (payment) => {
  const checkoutStatus = String(payment?.status || "").toLowerCase();
  const paymentStatus = String(payment?.paymentStatus || "").toLowerCase();

  if (
    checkoutStatus === "complete" &&
    paymentStatus === "paid" &&
    payment?.isFulfilled === true
  ) {
    return "success";
  }

  return "pending";
};

export const usePaymentStatus = (sessionId) => {
  const [verificationState, setVerificationState] = useState(
    sessionId ? "verifying" : "invalid",
  );
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  const verifyPayment = useCallback(
    async ({ signal } = {}) => {
      if (!sessionId) {
        setVerificationState("invalid");
        setPayment(null);
        return false;
      }

      setVerificationState("verifying");
      setError("");

      try {
        const paymentData = await paymentApi.getCheckoutStatus(sessionId, {
          signal,
        });

        if (signal?.aborted) return false;

        setPayment(paymentData);
        setVerificationState(getVerificationState(paymentData));
        return true;
      } catch (requestError) {
        if (requestError.name === "AbortError") return false;

        setPayment(null);
        setError(requestError.message || "Unable to verify the payment.");
        setVerificationState("error");
        return false;
      }
    },
    [sessionId],
  );

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        return verifyPayment({ signal: controller.signal });
      }

      return false;
    });

    return () => controller.abort();
  }, [verifyPayment]);

  const retry = useCallback(() => verifyPayment(), [verifyPayment]);

  return {
    verificationState,
    payment,
    error,
    retry,
  };
};
