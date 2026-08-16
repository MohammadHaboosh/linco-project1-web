import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { memberApi } from "../api/memberApi";

const SEARCH_DEBOUNCE_MS = 300;

export const useInviteMember = (demoId, onSuccess) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("MEMBER");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery || selectedUser) return undefined;

    const controller = new AbortController();

    const debounceTimer = setTimeout(async () => {
      setIsSearching(true);

      try {
        const responseData = await memberApi.searchUsers(normalizedQuery, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setSearchResults(responseData.data);
        }
      } catch (requestError) {
        if (requestError.name === "AbortError") return;

        if (!controller.signal.aborted) {
          setSearchResults([]);
          setSearchError(t("user-search-failed"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchQuery, selectedUser, t]);

  const updateSearchQuery = useCallback((value) => {
    setSearchQuery(value);
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(Boolean(String(value ?? "").trim()));
    setSubmitError(null);
  }, []);

  const selectUser = useCallback((user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setSubmitError(null);
  }, []);

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
    setSearchQuery("");
    setSubmitError(null);
  }, []);

  const sendInvitation = useCallback(
    async (event) => {
      event?.preventDefault();
      setSubmitError(null);

      if (!selectedUser?.id) {
        setSubmitError(t("select-user-before-invitation"));
        return false;
      }

      if (!demoId) {
        setSubmitError(t("workspace-id-missing"));
        return false;
      }

      setIsSubmitting(true);

      try {
        const responseData = await memberApi.inviteMember({
          receiverId: selectedUser.id,
          demoId,
          role,
        });

        await onSuccess?.(responseData);
        return true;
      } catch {
        setSubmitError(t("invitation-send-failed"));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [demoId, onSuccess, role, selectedUser, t],
  );

  return {
    searchQuery,
    setSearchQuery: updateSearchQuery,
    searchResults,
    selectedUser,
    selectUser,
    clearSelectedUser,
    role,
    setRole,
    isSearching,
    searchError,
    isSubmitting,
    submitError,
    sendInvitation,
  };
};
