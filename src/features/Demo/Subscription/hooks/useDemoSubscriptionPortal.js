import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { demoPlanApi } from "../api/demoPlanApi";

export const useDemoSubscriptionPortal = (demoId) => {
  const { t } = useTranslation();
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [portalError, setPortalError] = useState("");

  const openSubscriptionPortal = useCallback(async () => {
    if (isOpeningPortal) return false;

    setIsOpeningPortal(true);
    setPortalError("");

    try {
      const portalUrl = await demoPlanApi.createSubscriptionPortalSession({
        demoId,
      });

      window.location.assign(portalUrl);
      return true;
    } catch {
      setPortalError(t("subscription-portal-start-failed"));
      setIsOpeningPortal(false);
      return false;
    }
  }, [demoId, isOpeningPortal, t]);

  return {
    isOpeningPortal,
    portalError,
    openSubscriptionPortal,
  };
};
