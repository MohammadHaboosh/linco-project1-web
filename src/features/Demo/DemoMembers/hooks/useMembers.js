import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { memberApi } from "../api/memberApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useMembers = (demoId) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(demoId));
  const [error, setError] = useState(null);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const loadMembers = useCallback(
    async ({ signal } = {}) => {
      if (!demoId) {
        setMembers([]);
        setMeta(null);
        setError(t("workspace-id-missing"));
        setIsLoading(false);
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const responseData = await memberApi.getMembers(demoId, { signal });

        setMembers(Array.isArray(responseData.data) ? responseData.data : []);
        setMeta(responseData.meta ?? null);
        return true;
      } catch (requestError) {
        if (requestError.name === "AbortError") return false;

        setMembers([]);
        setMeta(null);
        setError(
          getApiErrorMessage(
            requestError,
            t("workspace-members-load-failed"),
          ),
        );
        return false;
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [demoId, t],
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
          getApiErrorMessage(
            requestError,
            t("workspace-member-remove-failed"),
          ),
        );
        return false;
      } finally {
        setDeletingMemberId(null);
      }
    },
    [demoId, deletingMemberId, t],
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
