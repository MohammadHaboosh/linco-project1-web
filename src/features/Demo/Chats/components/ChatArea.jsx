import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  IoAttachOutline,
  IoChatbubblesOutline,
  IoCloseOutline,
  IoCloudOfflineOutline,
  IoRefreshOutline,
  IoSend,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import ChatEmptyState from "./ChatEmptyState";
import MessageItem from "./MessageItem";
import { getSenderName } from "../utils/messageUtils";
import styles from "./Chats.module.css";

const TYPING_IDLE_DELAY = 1500;

const ChatArea = ({
  messages,
  currentDepartmentMemberId,
  connectionStatus,
  isLoadingHistory,
  isLoadingOlder,
  isSending,
  pendingActionId,
  typingMemberIds,
  hasNextPage,
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
}) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const inputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const shouldStickToBottomRef = useRef(true);
  const hasCompletedInitialScrollRef = useRef(false);
  const pendingScrollPreservationRef = useRef(null);

  const isConnected = connectionStatus === "connected";

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTypingStatus(false);
    }
  }, [sendTypingStatus]);

  useEffect(() => () => stopTyping(), [stopTyping]);

  useEffect(() => {
    if (!isConnected) {
      stopTyping();
    }
  }, [isConnected, stopTyping]);

  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || isLoadingHistory) {
      return;
    }

    const pendingPreservation = pendingScrollPreservationRef.current;
    if (pendingPreservation) {
      if (isLoadingOlder) {
        return;
      }

      if (messages.length > pendingPreservation.messageCount) {
        const addedHeight =
          scrollArea.scrollHeight - pendingPreservation.scrollHeight;
        scrollArea.scrollTop = pendingPreservation.scrollTop + addedHeight;
      }
      pendingScrollPreservationRef.current = null;
      return;
    }

    if (!hasCompletedInitialScrollRef.current) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
      hasCompletedInitialScrollRef.current = true;
      return;
    }

    if (shouldStickToBottomRef.current) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [isLoadingHistory, isLoadingOlder, messages]);

  const typingText = useMemo(() => {
    if (typingMemberIds.length === 0) {
      return "";
    }

    const senderNames = new Map();
    messages.forEach((message) => {
      if (message.sender?.id) {
        senderNames.set(message.sender.id, getSenderName(message));
      }
    });

    const knownNames = typingMemberIds
      .map((memberId) => senderNames.get(memberId))
      .filter(Boolean);

    if (typingMemberIds.length === 1 && knownNames[0]) {
      return t("chat-member-typing", { name: knownNames[0] });
    }

    if (typingMemberIds.length === 1) {
      return t("chat-someone-typing");
    }

    return t("chat-people-typing", { count: typingMemberIds.length });
  }, [messages, t, typingMemberIds]);

  const connectionLabel = t(`chat-status-${connectionStatus}`, {
    defaultValue: t("chat-status-disconnected"),
  });

  const visibleErrors = useMemo(
    () =>
      [...new Set([historyError, connectionError, actionError].filter(Boolean))],
    [actionError, connectionError, historyError],
  );

  const handleDraftChange = (event) => {
    const nextDraft = event.target.value;
    setDraft(nextDraft);

    if (editingMessage || !isConnected || !nextDraft.trim()) {
      stopTyping();
      return;
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(stopTyping, TYPING_IDLE_DELAY);
  };

  const resetComposer = useCallback(() => {
    setDraft("");
    setReplyingTo(null);
    setEditingMessage(null);
    stopTyping();
  }, [stopTyping]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !isConnected) {
      return;
    }

    try {
      if (editingMessage) {
        await editMessage(editingMessage.id, content);
      } else {
        await sendMessage({
          content,
          replyToId: replyingTo?.id,
        });
      }

      resetComposer();
      inputRef.current?.focus();
    } catch {
      // The hook exposes the server or timeout error in the chat banner.
    }
  };

  const handleReply = (message) => {
    setEditingMessage(null);
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleEdit = (message) => {
    stopTyping();
    setReplyingTo(null);
    setEditingMessage(message);
    setDraft(message.content || "");
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const handleDelete = async (message) => {
    if (!window.confirm(t("chat-delete-confirmation"))) {
      return;
    }

    try {
      await deleteMessage(message.id);
      if (
        editingMessage?.id === message.id ||
        replyingTo?.id === message.id
      ) {
        resetComposer();
      }
    } catch {
      // The hook exposes the server or timeout error in the chat banner.
    }
  };

  const handleLoadOlder = useCallback(async () => {
    const scrollArea = scrollAreaRef.current;
    if (
      !scrollArea ||
      !hasNextPage ||
      isLoadingOlder ||
      pendingScrollPreservationRef.current
    ) {
      return;
    }

    pendingScrollPreservationRef.current = {
      scrollHeight: scrollArea.scrollHeight,
      scrollTop: scrollArea.scrollTop,
      messageCount: messages.length,
    };

    const loaded = await loadOlderMessages();
    if (!loaded) {
      pendingScrollPreservationRef.current = null;
    }
  }, [hasNextPage, isLoadingOlder, loadOlderMessages, messages.length]);

  const handleScroll = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    const distanceFromBottom =
      scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < 120;

    if (scrollArea.scrollTop < 80 && hasNextPage && !isLoadingOlder) {
      handleLoadOlder();
    }
  };

  const composerContext = editingMessage || replyingTo;
  const composerContextLabel = editingMessage
    ? t("chat-editing-message")
    : t("chat-replying-to", {
        name: replyingTo ? getSenderName(replyingTo) : "",
      });

  const isSubmitting = isSending || Boolean(pendingActionId);
  const canSubmit = isConnected && Boolean(draft.trim()) && !isSubmitting;

  return (
    <section className={styles.chatRoomWrapper}>
      <header className={styles.roomHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.roomAvatar} aria-hidden="true">
            <IoChatbubblesOutline />
          </div>
          <div className={styles.roomMeta}>
            <h2>{t("department-chat")}</h2>
            <span
              className={`${styles.connectionStatus} ${
                styles[`status-${connectionStatus}`] || ""
              }`}
            >
              <span className={styles.statusDot} />
              {connectionLabel}
            </span>
          </div>
        </div>

        {connectionStatus !== "connected" && (
          <button
            type="button"
            className={styles.retryHeaderButton}
            onClick={retry}
          >
            <IoRefreshOutline />
            {t("try-again")}
          </button>
        )}
      </header>

      {visibleErrors.length > 0 && (
        <div className={styles.errorStack} role="alert">
          {visibleErrors.map((error) => (
            <div className={styles.errorBanner} key={error}>
              <IoCloudOfflineOutline aria-hidden="true" />
              <span>{t(error, { defaultValue: error })}</span>
              <div className={styles.errorActions}>
                <button type="button" onClick={retry}>
                  {t("try-again")}
                </button>
                {error === actionError && (
                  <button
                    type="button"
                    onClick={clearActionError}
                    aria-label={t("close")}
                  >
                    <IoCloseOutline />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={styles.messagesScrollArea}
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        {hasNextPage && (
          <button
            type="button"
            className={styles.loadOlderButton}
            onClick={handleLoadOlder}
            disabled={isLoadingOlder}
          >
            {isLoadingOlder
              ? t("chat-loading-older")
              : t("chat-load-older")}
          </button>
        )}

        {isLoadingHistory && messages.length === 0 ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner} />
            <p>{t("chat-loading-conversation")}</p>
          </div>
        ) : messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isMe={message.sender.id === currentDepartmentMemberId}
              isPending={Boolean(pendingActionId) || isSending}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <div className={styles.typingArea} aria-live="polite">
        {typingText}
      </div>

      <footer className={styles.inputStickyArea}>
        {composerContext && (
          <div className={styles.composerContext}>
            <div>
              <strong>{composerContextLabel}</strong>
              <span>
                {composerContext.content ||
                  t("chat-referenced-message-unavailable")}
              </span>
            </div>
            <button
              type="button"
              onClick={resetComposer}
              aria-label={t("cancel")}
            >
              <IoCloseOutline />
            </button>
          </div>
        )}

        <form className={styles.inputWrapper} onSubmit={handleSubmit}>
          <button
            type="button"
            className={styles.actionIcon}
            disabled
            title={t("chat-attachments-coming-soon")}
            aria-label={t("chat-attachments-coming-soon")}
          >
            <IoAttachOutline />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder={
              isConnected
                ? t("write-your-message")
                : t("chat-waiting-for-connection")
            }
            value={draft}
            onChange={handleDraftChange}
            disabled={!isConnected}
            autoComplete="off"
          />

          <button
            type="submit"
            className={`${styles.sendBtn} ${
              canSubmit ? styles.sendBtnActive : ""
            }`}
            disabled={!canSubmit}
            aria-label={
              editingMessage ? t("chat-save-edit") : t("chat-send-message")
            }
          >
            <IoSend />
          </button>
        </form>
      </footer>
    </section>
  );
};

export default ChatArea;
