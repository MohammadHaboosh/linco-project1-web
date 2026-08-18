import { useState } from "react";
import { useTranslation } from "react-i18next";
import { saveCourseCheckoutContext } from "../../../Payment/utils/courseCheckoutContext";
import { libraryApi } from "../api/libraryApi";

export const useBuyCourse = () => {
  const { t } = useTranslation();
  const [isBuying, setIsBuying] = useState(false);
  const [buyError, setBuyError] = useState(null);

  const initiatePurchase = async (demoId, courseId) => {
    setIsBuying(true);
    setBuyError(null);
    try {
      const response = await libraryApi.buyCourse(demoId, courseId);

      if (response.success && response.data?.url) {
        saveCourseCheckoutContext({ demoId, courseId });
        window.location.href = response.data.url;
      } else {
        throw new Error("checkout-url-missing");
      }
    } catch (error) {
      setBuyError(t("course-purchase-start-failed"));
      console.error(error);
    } finally {
      setIsBuying(false);
    }
  };

  return { initiatePurchase, isBuying, buyError };
};
