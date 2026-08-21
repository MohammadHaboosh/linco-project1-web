import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { leaderboardApi } from "../api/leaderboardApi";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useLeaderboard = () => {
  const { t } = useTranslation();
  const { demoId, departmentId } = useParams();
  const hasRequiredIds = Boolean(demoId && departmentId);

  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(hasRequiredIds);
  const [error, setError] = useState(
    hasRequiredIds ? "" : t("leaderboard-load-error-message"),
  );
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!demoId || !departmentId) {
      return undefined;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await leaderboardApi.getDepartmentLeaderboard(
          demoId,
          departmentId,
          { signal: controller.signal },
        );

        if (isMounted) {
          setLeaderboard(
            Array.isArray(response?.data) ? response.data.filter(Boolean) : [],
          );
        }
      } catch (err) {
        if (err?.name !== "AbortError" && isMounted) {
          setLeaderboard([]);
          setError(
            getApiErrorMessage(
              err,
              t("leaderboard-load-error-message"),
            ),
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [demoId, departmentId, reloadVersion, t]);

  return {
    leaderboard,
    isLoading: hasRequiredIds && isLoading,
    error: !hasRequiredIds ? t("leaderboard-load-error-message") : error,
    retry: () => setReloadVersion((version) => version + 1),
  };
};
