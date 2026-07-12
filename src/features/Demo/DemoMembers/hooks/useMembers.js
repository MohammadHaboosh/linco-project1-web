import { useCallback, useEffect, useState } from "react";
import { memberApi } from "../api/memberApi";

export const useMembers = (demoId) => {
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(demoId));
  const [error, setError] = useState(null);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const loadMembers = useCallback(
    async ({ signal } = {}) => {
      if (!demoId) return;

      try {
        const responseData = await memberApi.getMembers(demoId, { signal });

        setMembers(Array.isArray(responseData.data) ? responseData.data : []);
        setMeta(responseData.meta ?? null);
      } catch (requestError) {
        if (requestError.name === "AbortError") return;

        setMembers([]);
        setMeta(null);
        setError(requestError.message || "Failed to load demo members.");
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [demoId],
  );

  useEffect(() => {
    const controller = new AbortController();

    Promise.resolve().then(() => loadMembers({ signal: controller.signal }));

    return () => controller.abort();
  }, [loadMembers]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setDeleteError(null);

    return loadMembers();
  }, [loadMembers]);

  const deleteMember = useCallback(
    async (memberId) => {
      if (!demoId || !memberId || deletingMemberId) return false;

      setDeletingMemberId(memberId);
      setDeleteError(null);

      try {
        await memberApi.deleteMember(demoId, memberId);
        setMembers((currentMembers) =>
          currentMembers.filter((member) => member.id !== memberId),
        );
        return true;
      } catch (requestError) {
        setDeleteError(
          requestError.message || "Failed to remove the demo member.",
        );
        return false;
      } finally {
        setDeletingMemberId(null);
      }
    },
    [demoId, deletingMemberId],
  );

  return {
    members,
    meta,
    isLoading,
    error,
    deletingMemberId,
    deleteError,
    refetch,
    deleteMember,
  };
};
