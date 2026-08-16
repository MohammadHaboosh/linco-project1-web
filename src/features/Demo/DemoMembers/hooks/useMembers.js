import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { memberApi } from "../api/memberApi";

export const useMembers = (demoId) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(demoId));
  const [error, setError] = useState(null);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [updatingMemberId, setUpdatingMemberId] = useState(null);
  const [updateError, setUpdateError] = useState(null);

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
        setError(t("workspace-members-load-failed"));
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
    setUpdateError(null);

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
      } catch {
        setDeleteError(t("workspace-member-remove-failed"));
        return false;
      } finally {
        setDeletingMemberId(null);
      }
    },
    [demoId, deletingMemberId, t],
  );

  const updateMemberRole = useCallback(
    async (memberId, role) => {
      if (!demoId || !memberId || updatingMemberId) return false;

      const normalizedRole = String(role ?? "").trim().toUpperCase();

      setUpdatingMemberId(memberId);
      setUpdateError(null);

      try {
        const responseData = await memberApi.updateMemberRole(
          demoId,
          memberId,
          normalizedRole,
        );
        const responseMember = responseData?.data;

        setMembers((currentMembers) =>
          currentMembers.map((member) => {
            if (member.id !== memberId) return member;

            if (responseMember && typeof responseMember === "object") {
              return {
                ...member,
                ...responseMember,
                role: responseMember.role ?? normalizedRole,
              };
            }

            return { ...member, role: normalizedRole };
          }),
        );

        return true;
      } catch {
        setUpdateError(t("workspace-member-role-update-failed"));
        return false;
      } finally {
        setUpdatingMemberId(null);
      }
    },
    [demoId, t, updatingMemberId],
  );

  return {
    members,
    meta,
    isLoading,
    error,
    deletingMemberId,
    deleteError,
    updatingMemberId,
    updateError,
    refetch,
    deleteMember,
    updateMemberRole,
  };
};
