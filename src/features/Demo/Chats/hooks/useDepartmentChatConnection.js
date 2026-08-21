import { useCallback, useEffect, useRef, useState } from "react";
import { departmentMessagesApi } from "../api/departmentMessagesApi";
import { createDepartmentChatSocket } from "../services/departmentChatSocket";
import {
  mergeDepartmentMembersById,
  normalizeDepartmentMember,
} from "../utils/messageUtils";
import {
  CHAT_ACK_TIMEOUT,
  TYPING_EXPIRY,
  getErrorMessage,
} from "../utils/departmentChatUtils";

export const useDepartmentChatConnection = ({
  demoId,
  departmentId,
  contextKey,
  activeContextKeyRef,
  mergeMessages,
  bootstrapMessages,
  refreshMessages,
  setActionError,
}) => {
  const [currentDepartmentMemberId, setCurrentDepartmentMemberId] =
    useState(null);
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [typingMemberIds, setTypingMemberIds] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [connectionError, setConnectionError] = useState("");
  const socketRef = useRef(null);
  const connectionStatusRef = useRef("idle");
  const currentMemberIdRef = useRef(null);
  const typingTimeoutsRef = useRef(new Map());

  const updateConnectionStatus = useCallback((status) => {
    connectionStatusRef.current = status;
    setConnectionStatus(status);
  }, []);

  const upsertOnlineMembers = useCallback((incomingMembers) => {
    setOnlineMembers((currentMembers) =>
      mergeDepartmentMembersById(currentMembers, incomingMembers),
    );
  }, []);

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

    const handleTypingStatus = (member = {}) => {
      const { departmentMemberId, isTyping } = member;
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

      upsertOnlineMembers(member);
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

    const handleUserOnline = (member = {}) => {
      const { departmentMemberId } = member;
      if (isCurrentContext() && departmentMemberId) {
        upsertOnlineMembers(member);
      }
    };

    const handleUserOffline = ({ departmentMemberId } = {}) => {
      if (!isCurrentContext() || !departmentMemberId) {
        return;
      }

      setOnlineMembers((currentMembers) =>
        currentMembers.filter(
          (member) => member.departmentMemberId !== departmentMemberId,
        ),
      );
      removeTypingMember(departmentMemberId);
    };

    const handleSocketException = (error) => {
      if (!isCurrentContext()) {
        return;
      }

      if (connectionStatusRef.current === "joining") {
        updateConnectionStatus("error");
        setConnectionError((currentError) =>
          currentError || getErrorMessage(error, "chat-error-join"),
        );
        return;
      }

      setActionError(
        getErrorMessage(error, "chat-error-request-rejected"),
      );
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
            getErrorMessage(error, "chat-error-authenticate"),
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
        void recoverSocketAuthentication();
      }
    };

    const joinDepartment = () => {
      if (!isCurrentContext() || !socket.connected) {
        return;
      }

      const currentJoinAttempt = ++joinAttempt;
      updateConnectionStatus("joining");
      socket.timeout(CHAT_ACK_TIMEOUT).emit(
        "joinChat",
        { departmentId },
        (timeoutError, response) => {
          if (!isCurrentContext() || currentJoinAttempt !== joinAttempt) {
            return;
          }

          if (timeoutError) {
            setConnectionError(
              (currentError) =>
                currentError || "chat-error-join-timeout",
            );
            updateConnectionStatus("error");
            return;
          }

          if (response?.status !== "joined") {
            setConnectionError(
              getErrorMessage(response, "chat-error-join"),
            );
            updateConnectionStatus("error");
            return;
          }

          const joinedMember = normalizeDepartmentMember(
            response?.member || {
              departmentMemberId: response?.departmentMemberId,
            },
          );
          const memberId = joinedMember?.departmentMemberId || null;
          const responseOnlineMembers = Array.isArray(response?.onlineMembers)
            ? response.onlineMembers
            : Array.isArray(response?.onlineMemberIds)
              ? response.onlineMemberIds.map((departmentMemberId) => ({
                  departmentMemberId,
                }))
              : [];

          currentMemberIdRef.current = memberId;
          setCurrentDepartmentMemberId(memberId);
          setOnlineMembers(
            mergeDepartmentMembersById(responseOnlineMembers, joinedMember),
          );
          setConnectionError("");
          updateConnectionStatus("connected");
          refreshMessages(historyController.signal).catch(() => undefined);
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

      setCurrentDepartmentMemberId(null);
      currentMemberIdRef.current = null;
      setTypingMemberIds([]);
      setOnlineMembers([]);
      setConnectionError("");
      updateConnectionStatus("connecting");

      try {
        await bootstrapMessages(historyController.signal);
      } finally {
        if (isCurrentContext()) {
          socket.connect();
        }
      }
    };

    void bootstrap();

    return () => {
      isActive = false;
      joinAttempt += 1;
      historyController.abort();
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
    activeContextKeyRef,
    bootstrapMessages,
    contextKey,
    demoId,
    departmentId,
    mergeMessages,
    refreshMessages,
    setActionError,
    updateConnectionStatus,
    upsertOnlineMembers,
  ]);

  const emitWithAcknowledgement = useCallback((event, payload) => {
    const socket = socketRef.current;
    if (!socket?.connected || connectionStatusRef.current !== "connected") {
      return Promise.reject(
        new Error("The department chat is not connected yet."),
      );
    }

    return new Promise((resolve, reject) => {
      socket
        .timeout(CHAT_ACK_TIMEOUT)
        .emit(event, payload, (timeoutError, response) => {
          if (timeoutError) {
            reject(new Error("chat-error-server-timeout"));
            return;
          }

          if (response?.status !== "success") {
            reject(
              new Error(
                getErrorMessage(response, "chat-error-request-rejected"),
              ),
            );
            return;
          }

          resolve(response);
        });
    });
  }, []);

  const sendTypingStatus = useCallback((isTyping) => {
    const socket = socketRef.current;
    if (socket?.connected && connectionStatusRef.current === "connected") {
      socket.emit("typing", { isTyping: Boolean(isTyping) });
    }
  }, []);

  const retryConnection = useCallback(() => {
    setConnectionError("");
    const socket = socketRef.current;
    if (socket?.connected && connectionStatusRef.current !== "connected") {
      updateConnectionStatus("connecting");
      socket.disconnect().connect();
    } else if (socket && !socket.connected) {
      updateConnectionStatus("connecting");
      socket.connect();
    }
  }, [updateConnectionStatus]);

  return {
    currentDepartmentMemberId,
    connectionStatus,
    typingMemberIds,
    onlineMembers,
    connectionError,
    setConnectionError,
    emitWithAcknowledgement,
    sendTypingStatus,
    retryConnection,
  };
};
