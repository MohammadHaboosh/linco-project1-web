import { useState, useEffect, useCallback } from "react";
import { ownerReportApi } from "../api/ownerReportApi";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useOwnerReport = (demoId) => {
  const { t } = useTranslation();
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!demoId);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    if (!demoId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await ownerReportApi.getDemoOwnerReport(demoId);
      setReportData(data);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setError(
        getApiErrorMessage(
          err,
          t("analytics-report-load-error-message"),
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [demoId, t]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchReport();
    });
  }, [fetchReport]);

  return { reportData, isLoading, error, refetch: fetchReport };
};
