import { useState } from "react";
import { libraryApi } from "../api/libraryApi";

export const useBuyCourse = () => {
  const [isBuying, setIsBuying] = useState(false);
  const [buyError, setBuyError] = useState(null);

  const initiatePurchase = async (demoId, courseId) => {
    setIsBuying(true);
    setBuyError(null);
    try {
      const response = await libraryApi.buyCourse(demoId, courseId);

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("Error initiating purchase. Please try again later.");
      }
    } catch (error) {
      setBuyError(
        error.message || "Error initiating purchase. Please try again later.",
      );
      console.error(error);
    } finally {
      setIsBuying(false);
    }
  };

  return { initiatePurchase, isBuying, buyError };
};
