import { useCallback, useEffect, useState } from "react";
import { memberApi } from "../api/memberApi";

const SEARCH_DEBOUNCE_MS = 300;

export const useInviteMember = (demoId, onSuccess) => {
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
          setSearchError(requestError.message || "Failed to search users.");
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
  }, [searchQuery, selectedUser]);

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
        setSubmitError("Please select a user before sending the invitation.");
        return false;
      }

      if (!demoId) {
        setSubmitError("Demo ID is missing.");
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
      } catch (requestError) {
        setSubmitError(
          requestError.message || "Failed to send the invitation.",
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [demoId, onSuccess, role, selectedUser],
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
