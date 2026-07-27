import { useCallback, useEffect, useState } from "react";
import { departmentMemberApi } from "../api/departmentMemberApi";
import { useParams } from "react-router-dom";

export const useDepartmentMembers = (departmentId) => {
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(departmentId));
  const [error, setError] = useState(null);
  const { demoId } = useParams();

  const loadMembers = useCallback(
    async ({ signal } = {}) => {
      if (!departmentId) {
        setMembers([]);
        setMeta(null);
        setError("Department ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const responseData = await departmentMemberApi.getMembers(
          departmentId,
          demoId,
          { signal },
        );

        if (signal?.aborted) return;

        setMembers(Array.isArray(responseData.data) ? responseData.data : []);
        setMeta(responseData.meta ?? null);
      } catch (requestError) {
        if (requestError.name === "AbortError") return;

        setMembers([]);
        setMeta(null);
        setError(requestError.message || "Failed to load department members.");
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [departmentId],
  );

  useEffect(() => {
    const controller = new AbortController();

    Promise.resolve().then(() => loadMembers({ signal: controller.signal }));

    return () => controller.abort();
  }, [loadMembers]);

  const refetch = useCallback(() => loadMembers(), [loadMembers]);

  return {
    members,
    meta,
    isLoading,
    error,
    refetch,
  };
};
