import { useState, useEffect, useCallback } from "react";
import { ownerReportApi } from "../api/ownerReportApi";

export const useOwnerReport = (demoId) => {
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
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [demoId]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchReport();
    });
  }, [fetchReport]);

  return { reportData, isLoading, error, refetch: fetchReport };
};
