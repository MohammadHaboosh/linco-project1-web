import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { leaderboardApi } from "../api/leaderboardApi";

export const useLeaderboard = () => {
  const { demoId, departmentId } = useParams();

  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!demoId || !departmentId) return;

    let isMounted = true;
    const controller = new AbortController();

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await leaderboardApi.getDepartmentLeaderboard(
          demoId,
          departmentId,
          { signal: controller.signal },
        );

        if (isMounted && response.data) {
          setLeaderboard(response.data);
        }
      } catch (err) {
        if (err.name !== "AbortError" && isMounted) {
          setError(err.message || "Failed to load leaderboard");
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
  }, [demoId, departmentId]);

  return { leaderboard, isLoading, error };
};
