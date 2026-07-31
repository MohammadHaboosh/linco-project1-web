import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { departmentMessagesApi } from "../api/departmentMessagesApi";
import { mergeMessagesById } from "../utils/messageUtils";
import { getErrorMessage } from "../utils/departmentChatUtils";
import { useDepartmentChatActions } from "./useDepartmentChatActions";
import { useDepartmentChatConnection } from "./useDepartmentChatConnection";

export const useDepartmentChat = ({ demoId, departmentId }) => {
  const contextKey = `${demoId ?? ""}:${departmentId ?? ""}`;
  const activeContextKeyRef = useRef(contextKey);
  const [messages, setMessages] = useState([]);
  const [pageMeta, setPageMeta] = useState({
    hasNextPage: false,
    endCursor: null,
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [actionError, setActionError] = useState("");

  useLayoutEffect(() => {
    activeContextKeyRef.current = contextKey;
  }, [contextKey]);

  const mergeMessages = useCallback((incomingMessages) => {
    const safeMessages = Array.isArray(incomingMessages)
      ? incomingMessages
      : [incomingMessages];

    setMessages((currentMessages) =>
      mergeMessagesById(currentMessages, safeMessages),
    );
  }, []);

  const fetchLatestMessages = useCallback(
    async ({
      signal,
      showLoader = false,
      replacePageMeta = false,
    } = {}) => {
      if (!demoId || !departmentId) {
        return false;
      }

      const requestContextKey = contextKey;
      if (showLoader) {
        setIsLoadingHistory(true);
      }

      try {
        const result = await departmentMessagesApi.getMessages({
          demoId,
          departmentId,
          signal,
        });

        if (activeContextKeyRef.current !== requestContextKey) {
          return false;
        }

        mergeMessages(result.messages);
        setPageMeta((currentMeta) =>
          replacePageMeta || !currentMeta.endCursor
            ? result.meta
            : currentMeta,
        );
        setHistoryError("");
        return true;
      } catch (error) {
        if (
          activeContextKeyRef.current === requestContextKey &&
          error.name !== "AbortError"
        ) {
          setHistoryError(
            getErrorMessage(
              error,
              "Unable to load the department conversation.",
            ),
          );
          throw error;
        }

        return false;
      } finally {
        if (
          showLoader &&
          activeContextKeyRef.current === requestContextKey
        ) {
          setIsLoadingHistory(false);
        }
      }
    },
    [contextKey, demoId, departmentId, mergeMessages],
  );

  const bootstrapMessages = useCallback(
    async (signal) => {
      setMessages([]);
      setPageMeta({ hasNextPage: false, endCursor: null });
      setIsLoadingOlder(false);
      setHistoryError("");
      setActionError("");

      try {
        await fetchLatestMessages({
          signal,
          showLoader: true,
          replacePageMeta: true,
        });
      } catch {
        // The socket can still connect and recover the latest messages.
      }
    },
    [fetchLatestMessages],
  );

  const refreshMessages = useCallback(
    (signal) => fetchLatestMessages({ signal }),
    [fetchLatestMessages],
  );

  const {
    currentDepartmentMemberId,
    connectionStatus,
    typingMemberIds,
    onlineMembers,
    connectionError,
    setConnectionError,
    emitWithAcknowledgement,
    sendTypingStatus,
    retryConnection,
  } = useDepartmentChatConnection({
    demoId,
    departmentId,
    contextKey,
    activeContextKeyRef,
    mergeMessages,
    bootstrapMessages,
    refreshMessages,
    setActionError,
  });

  const {
    isSending,
    isUploadingAttachment,
    pendingActionId,
    prepareAttachment,
    sendMessage,
    editMessage,
    deleteMessage,
    clearActionError,
    discardPreparedAttachment,
  } = useDepartmentChatActions({
    demoId,
    departmentId,
    contextKey,
    activeContextKeyRef,
    emitWithAcknowledgement,
    setActionError,
  });

  const loadOlderMessages = useCallback(async () => {
    if (
      !demoId ||
      !departmentId ||
      !pageMeta.hasNextPage ||
      !pageMeta.endCursor ||
      isLoadingOlder
    ) {
      return false;
    }

    const requestContextKey = contextKey;
    setIsLoadingOlder(true);
    setHistoryError("");

    try {
      const result = await departmentMessagesApi.getMessages({
        demoId,
        departmentId,
        cursor: pageMeta.endCursor,
      });

      if (activeContextKeyRef.current !== requestContextKey) {
        return false;
      }

      mergeMessages(result.messages);
      setPageMeta(result.meta);
      return true;
    } catch (error) {
      if (activeContextKeyRef.current === requestContextKey) {
        setHistoryError(
          getErrorMessage(error, "Unable to load older messages."),
        );
      }
      return false;
    } finally {
      if (activeContextKeyRef.current === requestContextKey) {
        setIsLoadingOlder(false);
      }
    }
  }, [
    contextKey,
    demoId,
    departmentId,
    isLoadingOlder,
    mergeMessages,
    pageMeta.endCursor,
    pageMeta.hasNextPage,
  ]);

  const retry = useCallback(async () => {
    setHistoryError("");
    setConnectionError("");
    setActionError("");

    await fetchLatestMessages({
      showLoader: messages.length === 0,
      replacePageMeta: messages.length === 0,
    }).catch(() => undefined);

    retryConnection();
  }, [fetchLatestMessages, messages.length, retryConnection, setConnectionError]);

  return {
    messages,
    currentDepartmentMemberId,
    connectionStatus,
    isLoadingHistory,
    isLoadingOlder,
    isSending,
    isUploadingAttachment,
    pendingActionId,
    typingMemberIds,
    onlineMembers,
    hasNextPage: pageMeta.hasNextPage,
    historyError,
    connectionError,
    actionError,
    prepareAttachment,
    sendMessage,
    editMessage,
    deleteMessage,
    sendTypingStatus,
    loadOlderMessages,
    retry,
    clearActionError,
    discardPreparedAttachment,
  };
};
