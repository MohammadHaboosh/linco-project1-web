import { useCallback, useEffect, useRef, useState } from "react";
import { departmentMessagesApi } from "../api/departmentMessagesApi";
import { createDepartmentChatSocket } from "../services/departmentChatSocket";
import { mergeMessagesById } from "../utils/messageUtils";

const ACK_TIMEOUT = 10000;
const TYPING_EXPIRY = 3000;

const getAttachmentMessageType = (mimeType) => {
  if (mimeType?.startsWith("image/")) {
    return "IMAGE";
  }

  if (mimeType?.startsWith("audio/")) {
    return "AUDIO";
  }

  return "FILE";
};

const getAttachmentErrorKey = (error) => {
  if (error?.code === "CHAT_UPLOAD_URL_FAILED") {
    return "chat-attachment-preparation-failed";
  }

  if (error?.code === "CHAT_FILE_UPLOAD_FAILED") {
    return "chat-attachment-upload-failed";
  }

  return "";
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  if (typeof error?.error === "string") {
    return error.error;
  }

  return fallback;
};

export const useDepartmentChat = ({ demoId, departmentId }) => {
  const contextKey = `${demoId ?? ""}:${departmentId ?? ""}`;
  const [messages, setMessages] = useState([]);
  const [pageMeta, setPageMeta] = useState({
    hasNextPage: false,
    endCursor: null,
  });
  const [currentDepartmentMemberId, setCurrentDepartmentMemberId] =
    useState(null);
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [pendingActionId, setPendingActionId] = useState(null);
  const [typingMemberIds, setTypingMemberIds] = useState([]);
  const [onlineMemberIds, setOnlineMemberIds] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [actionError, setActionError] = useState("");

  const socketRef = useRef(null);
  const uploadControllerRef = useRef(null);
  const preparedAttachmentRef = useRef(null);
  const connectionStatusRef = useRef("idle");
  const currentMemberIdRef = useRef(null);
  const activeContextKeyRef = useRef(contextKey);
  const typingTimeoutsRef = useRef(new Map());
  activeContextKeyRef.current = contextKey;

  const updateConnectionStatus = useCallback((status) => {
    connectionStatusRef.current = status;
    setConnectionStatus(status);
  }, []);

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

  useEffect(() => {
    if (!demoId || !departmentId) {
      return undefined;
    }

    let isActive = true;
    let authRecoveryInProgress = false;
    let authRecoveryAttempts = 0;
    let joinAttempt = 0;
    const historyController = new AbortController();
    const socket = createDepartmentChatSocket();
    const typingTimeouts = typingTimeoutsRef.current;
    socketRef.current = socket;
    const isCurrentContext = () =>
      isActive && activeContextKeyRef.current === contextKey;

    const handleIncomingMessage = (message) => {
      if (
        !isCurrentContext() ||
        !message?.id ||
        message.departmentId !== departmentId
      ) {
        return;
      }

      mergeMessages(message);
    };

    const removeTypingMember = (departmentMemberId) => {
      const timeout = typingTimeouts.get(departmentMemberId);
      if (timeout) {
        clearTimeout(timeout);
        typingTimeouts.delete(departmentMemberId);
      }

      if (!isCurrentContext()) {
        return;
      }

      setTypingMemberIds((currentIds) =>
        currentIds.filter((id) => id !== departmentMemberId),
      );
    };

    const handleTypingStatus = ({ departmentMemberId, isTyping } = {}) => {
      if (
        !isCurrentContext() ||
        !departmentMemberId ||
        departmentMemberId === currentMemberIdRef.current
      ) {
        return;
      }

      removeTypingMember(departmentMemberId);

      if (!isTyping) {
        return;
      }

      setTypingMemberIds((currentIds) =>
        currentIds.includes(departmentMemberId)
          ? currentIds
          : [...currentIds, departmentMemberId],
      );

      const timeout = setTimeout(() => {
        removeTypingMember(departmentMemberId);
      }, TYPING_EXPIRY);
      typingTimeouts.set(departmentMemberId, timeout);
    };

    const handleUserOnline = ({ departmentMemberId } = {}) => {
      if (!isCurrentContext() || !departmentMemberId) {
        return;
      }

      setOnlineMemberIds((currentIds) =>
        currentIds.includes(departmentMemberId)
          ? currentIds
          : [...currentIds, departmentMemberId],
      );
    };

    const handleUserOffline = ({ departmentMemberId } = {}) => {
      if (!isCurrentContext() || !departmentMemberId) {
        return;
      }

      setOnlineMemberIds((currentIds) =>
        currentIds.filter((id) => id !== departmentMemberId),
      );
      removeTypingMember(departmentMemberId);
    };

    const handleSocketException = (error) => {
      if (!isCurrentContext()) {
        return;
      }

      const errorMessage = getErrorMessage(
        error,
        "The chat server rejected the request.",
      );

      if (connectionStatusRef.current === "joining") {
        updateConnectionStatus("error");
        setConnectionError((currentError) => currentError || errorMessage);
        return;
      }

      setActionError(errorMessage);
    };

    const recoverSocketAuthentication = async () => {
      if (
        authRecoveryInProgress ||
        authRecoveryAttempts >= 1 ||
        !isCurrentContext()
      ) {
        return;
      }

      authRecoveryInProgress = true;
      authRecoveryAttempts += 1;
      try {
        await departmentMessagesApi.getMessages({
          demoId,
          departmentId,
          take: 1,
        });

        if (isCurrentContext() && !socket.connected) {
          socket.connect();
        }
      } catch (error) {
        if (isCurrentContext()) {
          setConnectionError(
            getErrorMessage(error, "Unable to authenticate the chat session."),
          );
          updateConnectionStatus("error");
        }
      } finally {
        authRecoveryInProgress = false;
      }
    };

    const handleConnectError = (error) => {
      if (!isCurrentContext()) {
        return;
      }

      const message = getErrorMessage(
        error,
        "Unable to connect to the department chat.",
      );
      setConnectionError(message);
      updateConnectionStatus("error");

      if (message.toUpperCase().includes("UNAUTHORIZED")) {
        recoverSocketAuthentication();
      }
    };

    const joinDepartment = () => {
      if (!isCurrentContext() || !socket.connected) {
        return;
      }

      const currentJoinAttempt = ++joinAttempt;
      updateConnectionStatus("joining");
      socket.timeout(ACK_TIMEOUT).emit(
        "joinChat",
        { departmentId },
        (timeoutError, response) => {
          if (
            !isCurrentContext() ||
            currentJoinAttempt !== joinAttempt
          ) {
            return;
          }

          if (timeoutError) {
            setConnectionError(
              (currentError) =>
                currentError || "Joining the department chat timed out.",
            );
            updateConnectionStatus("error");
            return;
          }

          if (response?.status !== "joined") {
            setConnectionError("Unable to join the department chat.");
            updateConnectionStatus("error");
            return;
          }

          const memberId = response.departmentMemberId || null;
          currentMemberIdRef.current = memberId;
          setCurrentDepartmentMemberId(memberId);
          setConnectionError("");
          updateConnectionStatus("connected");

          fetchLatestMessages({
            signal: historyController.signal,
          }).catch(() => undefined);
        },
      );
    };

    const handleConnect = () => {
      if (!isCurrentContext()) {
        return;
      }

      authRecoveryAttempts = 0;
      setConnectionError("");
      joinDepartment();
    };

    const handleDisconnect = (reason) => {
      if (!isCurrentContext()) {
        return;
      }

      if (reason === "io client disconnect") {
        updateConnectionStatus("disconnected");
        return;
      }

      updateConnectionStatus(socket.active ? "reconnecting" : "disconnected");
    };

    const handleReconnectAttempt = () => {
      if (isCurrentContext()) {
        updateConnectionStatus("reconnecting");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("exception", handleSocketException);
    socket.on("messageReceived", handleIncomingMessage);
    socket.on("messageEdited", handleIncomingMessage);
    socket.on("messageDeleted", handleIncomingMessage);
    socket.on("userTypingStatus", handleTypingStatus);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);

    const bootstrap = async () => {
      await Promise.resolve();
      if (!isCurrentContext()) {
        return;
      }

      setMessages([]);
      setPageMeta({ hasNextPage: false, endCursor: null });
      setCurrentDepartmentMemberId(null);
      currentMemberIdRef.current = null;
      setTypingMemberIds([]);
      setOnlineMemberIds([]);
      setIsLoadingOlder(false);
      setIsSending(false);
      setIsUploadingAttachment(false);
      setPendingActionId(null);
      setHistoryError("");
      setConnectionError("");
      setActionError("");
      updateConnectionStatus("connecting");

      try {
        await fetchLatestMessages({
          signal: historyController.signal,
          showLoader: true,
          replacePageMeta: true,
        });
      } catch {
        // The socket can still connect and recover the latest messages.
      } finally {
        if (isCurrentContext()) {
          socket.connect();
        }
      }
    };

    bootstrap();

    return () => {
      isActive = false;
      joinAttempt += 1;
      historyController.abort();
      uploadControllerRef.current?.abort();
      uploadControllerRef.current = null;
      preparedAttachmentRef.current = null;

      typingTimeouts.forEach((timeout) => clearTimeout(timeout));
      typingTimeouts.clear();

      socket.io.off("reconnect_attempt", handleReconnectAttempt);
      socket.removeAllListeners();
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [
    contextKey,
    demoId,
    departmentId,
    fetchLatestMessages,
    mergeMessages,
    updateConnectionStatus,
  ]);

  const emitWithAcknowledgement = useCallback((event, payload) => {
    const socket = socketRef.current;

    if (
      !socket?.connected ||
      connectionStatusRef.current !== "connected"
    ) {
      return Promise.reject(
        new Error("The department chat is not connected yet."),
      );
    }

    return new Promise((resolve, reject) => {
      socket
        .timeout(ACK_TIMEOUT)
        .emit(event, payload, (timeoutError, response) => {
          if (timeoutError) {
            reject(new Error("The chat server did not respond in time."));
            return;
          }

          if (response?.status !== "success") {
            reject(new Error("The chat server rejected the request."));
            return;
          }

          resolve(response);
        });
    });
  }, []);

  const sendMessage = useCallback(
    async ({ content, replyToId, file }) => {
      const actionContextKey = contextKey;
      const normalizedContent = String(content || "").trim();
      if (!normalizedContent && !file) {
        throw new Error("A message or attachment is required.");
      }

      setIsSending(true);
      setActionError("");
      let uploadController = null;

      try {
        let preparedAttachment = null;

        if (file) {
          const cachedAttachment = preparedAttachmentRef.current;

          if (cachedAttachment?.file === file) {
            preparedAttachment = cachedAttachment.metadata;
          } else {
            uploadController = new AbortController();
            uploadControllerRef.current = uploadController;
            setIsUploadingAttachment(true);

            const upload = await departmentMessagesApi.requestUploadUrl({
              demoId,
              departmentId,
              fileName: file.name,
              signal: uploadController.signal,
            });

            await departmentMessagesApi.uploadFile({
              uploadUrl: upload.uploadUrl,
              file,
              signal: uploadController.signal,
            });

            if (activeContextKeyRef.current !== actionContextKey) {
              throw new DOMException("The chat context changed.", "AbortError");
            }

            const mimeType = file.type || "application/octet-stream";
            preparedAttachment = {
              type: getAttachmentMessageType(mimeType),
              fileUrl: upload.cdnUrl,
              fileName: upload.fileName || file.name,
              mimeType,
              fileSize: file.size,
            };
            preparedAttachmentRef.current = {
              file,
              metadata: preparedAttachment,
            };
            setIsUploadingAttachment(false);
          }
        }

        const response = await emitWithAcknowledgement("sendMessage", {
          type: preparedAttachment?.type || "TEXT",
          ...(normalizedContent ? { content: normalizedContent } : {}),
          ...(replyToId ? { replyToId } : {}),
          ...(preparedAttachment
            ? {
                fileUrl: preparedAttachment.fileUrl,
                fileName: preparedAttachment.fileName,
                mimeType: preparedAttachment.mimeType,
                fileSize: preparedAttachment.fileSize,
              }
            : {}),
        });

        preparedAttachmentRef.current = null;
        return response;
      } catch (error) {
        if (
          activeContextKeyRef.current === actionContextKey &&
          error.name !== "AbortError"
        ) {
          const attachmentErrorKey = getAttachmentErrorKey(error);
          setActionError(
            (currentError) =>
              currentError ||
              attachmentErrorKey ||
              getErrorMessage(error, "Unable to send the message."),
          );
        }
        throw error;
      } finally {
        if (uploadControllerRef.current === uploadController) {
          uploadControllerRef.current = null;
        }

        if (activeContextKeyRef.current === actionContextKey) {
          setIsUploadingAttachment(false);
          setIsSending(false);
        }
      }
    },
    [contextKey, demoId, departmentId, emitWithAcknowledgement],
  );

  const editMessage = useCallback(
    async (messageId, content) => {
      const actionContextKey = contextKey;
      const normalizedContent = String(content || "").trim();
      if (!normalizedContent) {
        throw new Error("A message cannot be empty.");
      }

      setPendingActionId(messageId);
      setActionError("");

      try {
        return await emitWithAcknowledgement("editMessage", {
          messageId,
          content: normalizedContent,
        });
      } catch (error) {
        if (activeContextKeyRef.current === actionContextKey) {
          setActionError(
            (currentError) =>
              currentError ||
              getErrorMessage(error, "Unable to edit the message."),
          );
        }
        throw error;
      } finally {
        if (activeContextKeyRef.current === actionContextKey) {
          setPendingActionId(null);
        }
      }
    },
    [contextKey, emitWithAcknowledgement],
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      const actionContextKey = contextKey;
      setPendingActionId(messageId);
      setActionError("");

      try {
        return await emitWithAcknowledgement("deleteMessage", { messageId });
      } catch (error) {
        if (activeContextKeyRef.current === actionContextKey) {
          setActionError(
            (currentError) =>
              currentError ||
              getErrorMessage(error, "Unable to delete the message."),
          );
        }
        throw error;
      } finally {
        if (activeContextKeyRef.current === actionContextKey) {
          setPendingActionId(null);
        }
      }
    },
    [contextKey, emitWithAcknowledgement],
  );

  const sendTypingStatus = useCallback((isTyping) => {
    const socket = socketRef.current;
    if (
      socket?.connected &&
      connectionStatusRef.current === "connected"
    ) {
      socket.emit("typing", { isTyping: Boolean(isTyping) });
    }
  }, []);

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

    const socket = socketRef.current;
    if (
      socket?.connected &&
      connectionStatusRef.current !== "connected"
    ) {
      updateConnectionStatus("connecting");
      socket.disconnect().connect();
    } else if (socket && !socket.connected) {
      updateConnectionStatus("connecting");
      socket.connect();
    }
  }, [fetchLatestMessages, messages.length, updateConnectionStatus]);

  const clearActionError = useCallback(() => setActionError(""), []);

  const discardPreparedAttachment = useCallback((file) => {
    if (!file || preparedAttachmentRef.current?.file === file) {
      preparedAttachmentRef.current = null;
    }
  }, []);

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
    onlineMemberIds,
    hasNextPage: pageMeta.hasNextPage,
    historyError,
    connectionError,
    actionError,
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
