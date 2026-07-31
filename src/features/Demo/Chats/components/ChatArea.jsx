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
import {
  formatFileSize,
  getDepartmentMemberInitials,
  getDepartmentMemberName,
  getSenderName,
  shouldGroupMessages,
} from "../utils/messageUtils";
import styles from "./Chats.module.css";

const TYPING_IDLE_DELAY = 1500;

const ChatArea = ({
  messages,
  currentDepartmentMemberId,
  connectionStatus,
  isLoadingHistory,
  isLoadingOlder,
  isSending,
  isUploadingAttachment,
  pendingActionId,
  typingMemberIds,
  onlineMembers = [],
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
  discardPreparedAttachment,
  prepareAttachment,
}) => {
  const { t, i18n } = useTranslation();
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState("");
  const [attachmentUploadStatus, setAttachmentUploadStatus] = useState("idle");
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const selectedAttachmentRef = useRef(null);
  const attachmentPreviewUrlRef = useRef("");
  const scrollAreaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const shouldStickToBottomRef = useRef(true);
  const hasCompletedInitialScrollRef = useRef(false);
  const pendingScrollPreservationRef = useRef(null);
  const isRestoringScrollRef = useRef(false);
  const restoreScrollFrameRef = useRef(null);

  const isConnected = connectionStatus === "connected";

  const clearSelectedAttachment = useCallback(() => {
    discardPreparedAttachment(selectedAttachmentRef.current);
    selectedAttachmentRef.current = null;
    clearActionError();

    if (attachmentPreviewUrlRef.current) {
      URL.revokeObjectURL(attachmentPreviewUrlRef.current);
      attachmentPreviewUrlRef.current = "";
    }

    setSelectedAttachment(null);
    setAttachmentPreviewUrl("");
    setAttachmentUploadStatus("idle");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [clearActionError, discardPreparedAttachment]);

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

  useEffect(
    () => () => {
      stopTyping();

      if (restoreScrollFrameRef.current) {
        cancelAnimationFrame(restoreScrollFrameRef.current);
      }

      if (attachmentPreviewUrlRef.current) {
        URL.revokeObjectURL(attachmentPreviewUrlRef.current);
        attachmentPreviewUrlRef.current = "";
      }
    },
    [stopTyping],
  );

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
        isRestoringScrollRef.current = true;
        scrollArea.scrollTop = pendingPreservation.scrollTop + addedHeight;

        restoreScrollFrameRef.current = requestAnimationFrame(() => {
          restoreScrollFrameRef.current = requestAnimationFrame(() => {
            isRestoringScrollRef.current = false;
            restoreScrollFrameRef.current = null;
          });
        });
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

  const sortedOnlineMembers = useMemo(
    () =>
      [...onlineMembers].sort((first, second) => {
        if (first.departmentMemberId === currentDepartmentMemberId) {
          return -1;
        }

        if (second.departmentMemberId === currentDepartmentMemberId) {
          return 1;
        }

        return getDepartmentMemberName(first, "").localeCompare(
          getDepartmentMemberName(second, ""),
        );
      }),
    [currentDepartmentMemberId, onlineMembers],
  );

  const onlineMembersById = useMemo(
    () =>
      new Map(
        onlineMembers.map((member) => [
          member.departmentMemberId,
          member,
        ]),
      ),
    [onlineMembers],
  );

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
      .map((memberId) => {
        const storedOnlineMember = onlineMembersById.get(memberId);
        return (
          getDepartmentMemberName(storedOnlineMember, "") ||
          senderNames.get(memberId)
        );
      })
      .filter(Boolean);

    if (typingMemberIds.length === 1 && knownNames[0]) {
      return t("chat-member-typing", { name: knownNames[0] });
    }

    if (typingMemberIds.length === 1) {
      return t("chat-someone-typing");
    }

    return t("chat-people-typing", { count: typingMemberIds.length });
  }, [messages, onlineMembersById, t, typingMemberIds]);

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
    clearSelectedAttachment();
    stopTyping();
  }, [clearSelectedAttachment, stopTyping]);

  const uploadSelectedAttachment = useCallback(
    async (file) => {
      setAttachmentUploadStatus("uploading");

      try {
        await prepareAttachment(file);
        if (selectedAttachmentRef.current === file) {
          setAttachmentUploadStatus("ready");
        }
      } catch (error) {
        if (
          selectedAttachmentRef.current === file &&
          error.name !== "AbortError"
        ) {
          setAttachmentUploadStatus("error");
        }
      }
    },
    [prepareAttachment],
  );

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    event.target.value = "";

    discardPreparedAttachment(selectedAttachmentRef.current);
    clearActionError();

    if (attachmentPreviewUrlRef.current) {
      URL.revokeObjectURL(attachmentPreviewUrlRef.current);
      attachmentPreviewUrlRef.current = "";
    }

    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : "";

    attachmentPreviewUrlRef.current = previewUrl;
    selectedAttachmentRef.current = file;
    setAttachmentPreviewUrl(previewUrl);
    setSelectedAttachment(file);
    void uploadSelectedAttachment(file);
  };

  const retrySelectedAttachment = () => {
    if (selectedAttachmentRef.current) {
      void uploadSelectedAttachment(selectedAttachmentRef.current);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (
      (!content && !selectedAttachment) ||
      (selectedAttachment && attachmentUploadStatus !== "ready") ||
      !isConnected
    ) {
      return;
    }

    try {
      if (editingMessage) {
        await editMessage(editingMessage.id, content);
      } else {
        await sendMessage({
          content,
          replyToId: replyingTo?.id,
          file: selectedAttachment,
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
    clearSelectedAttachment();
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
      isRestoringScrollRef.current ||
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
    if (!scrollArea || isRestoringScrollRef.current) {
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
  const isAttachmentUploading =
    attachmentUploadStatus === "uploading" || isUploadingAttachment;
  const hasReadyAttachment =
    Boolean(selectedAttachment) && attachmentUploadStatus === "ready";
  const canSubmit =
    isConnected &&
    Boolean(draft.trim() || hasReadyAttachment) &&
    (!selectedAttachment || hasReadyAttachment) &&
    !isSubmitting &&
    !isAttachmentUploading;

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

        <div className={styles.headerActions}>
          {isConnected && sortedOnlineMembers.length > 0 && (
            <details className={styles.onlineMembersMenu}>
              <summary
                className={styles.onlineMembersSummary}
                aria-label={t("chat-online-count", {
                  count: sortedOnlineMembers.length,
                })}
              >
                <span className={styles.onlineAvatarStack} aria-hidden="true">
                  {sortedOnlineMembers.slice(0, 3).map((member) => {
                    const memberName = getDepartmentMemberName(
                      member,
                      t("chat-unknown-member"),
                    );

                    return (
                      <span
                        className={styles.onlineAvatar}
                        key={member.departmentMemberId}
                        title={memberName}
                      >
                        {member.imagePath ? (
                          <img src={member.imagePath} alt="" />
                        ) : (
                          getDepartmentMemberInitials(member)
                        )}
                      </span>
                    );
                  })}
                  {sortedOnlineMembers.length > 3 && (
                    <span className={styles.onlineAvatarOverflow}>
                      +{sortedOnlineMembers.length - 3}
                    </span>
                  )}
                </span>
                <span className={styles.onlineCountLabel}>
                  {t("chat-online-count", {
                    count: sortedOnlineMembers.length,
                  })}
                </span>
              </summary>

              <div className={styles.onlineMembersPopover}>
                <strong className={styles.onlineMembersTitle}>
                  {t("chat-online-members")}
                </strong>
                <ul className={styles.onlineMembersList}>
                  {sortedOnlineMembers.map((member) => {
                    const memberName = getDepartmentMemberName(
                      member,
                      t("chat-unknown-member"),
                    );
                    const isCurrentMember =
                      member.departmentMemberId ===
                      currentDepartmentMemberId;

                    return (
                      <li
                        className={styles.onlineMemberItem}
                        key={member.departmentMemberId}
                      >
                        <span className={styles.onlineMemberAvatar}>
                          {member.imagePath ? (
                            <img src={member.imagePath} alt="" />
                          ) : (
                            getDepartmentMemberInitials(member)
                          )}
                          <span className={styles.onlinePresenceDot} />
                        </span>
                        <span className={styles.onlineMemberDetails}>
                          <strong>
                            {memberName}
                            {isCurrentMember && ` (${t("chat-you")})`}
                          </strong>
                          <small>{t("chat-online-now")}</small>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          )}

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
        </div>
      </header>

      {visibleErrors.length > 0 && (
        <div className={styles.errorStack} role="alert">
          {visibleErrors.map((error) => (
            <div className={styles.errorBanner} key={error}>
              <IoCloudOfflineOutline aria-hidden="true" />
              <span>{t(error, { defaultValue: error })}</span>
              <div className={styles.errorActions}>
                <button
                  type="button"
                  onClick={
                    error === actionError &&
                    attachmentUploadStatus === "error"
                      ? retrySelectedAttachment
                      : retry
                  }
                >
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
          messages.map((message, index) => {
            const hasPreviousInGroup = shouldGroupMessages(
              messages[index - 1],
              message,
            );
            const hasNextInGroup = shouldGroupMessages(
              message,
              messages[index + 1],
            );
            const groupPosition = hasPreviousInGroup
              ? hasNextInGroup
                ? "middle"
                : "last"
              : hasNextInGroup
                ? "first"
                : "single";

            return (
              <MessageItem
                key={message.id}
                message={message}
                groupPosition={groupPosition}
                isMe={message.sender.id === currentDepartmentMemberId}
                isPending={Boolean(pendingActionId) || isSending}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })
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
                  composerContext.attachment?.fileName ||
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

        {selectedAttachment && (
          <div className={styles.selectedAttachment} aria-live="polite">
            {attachmentPreviewUrl ? (
              <img
                src={attachmentPreviewUrl}
                alt=""
                className={styles.selectedAttachmentPreview}
              />
            ) : (
              <span
                className={styles.selectedAttachmentIcon}
                aria-hidden="true"
              >
                <IoAttachOutline />
              </span>
            )}

            <div className={styles.selectedAttachmentDetails}>
              <strong>{selectedAttachment.name}</strong>
              <span
                className={
                  isAttachmentUploading
                    ? styles.attachmentUploading
                    : attachmentUploadStatus === "error"
                      ? styles.attachmentUploadError
                      : styles.attachmentReady
                }
              >
                {isAttachmentUploading
                  ? t("chat-uploading-attachment")
                  : attachmentUploadStatus === "error"
                    ? t("chat-attachment-upload-failed")
                    : t("chat-attachment-ready", {
                        size: formatFileSize(
                          selectedAttachment.size,
                          i18n.language,
                        ),
                      })}
              </span>
            </div>

            <button
              type="button"
              className={styles.removeAttachmentButton}
              onClick={clearSelectedAttachment}
              disabled={isSubmitting || isAttachmentUploading}
              title={t("chat-remove-attachment")}
              aria-label={t("chat-remove-attachment")}
            >
              <IoCloseOutline />
            </button>
          </div>
        )}

        <form className={styles.inputWrapper} onSubmit={handleSubmit}>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleAttachmentChange}
            disabled={
              isSubmitting || isAttachmentUploading || Boolean(editingMessage)
            }
          />

          <button
            type="button"
            className={styles.actionIcon}
            onClick={() => fileInputRef.current?.click()}
            disabled={
              isSubmitting || isAttachmentUploading || Boolean(editingMessage)
            }
            title={
              editingMessage
                ? t("chat-edit-attachment-unavailable")
                : t("chat-select-attachment")
            }
            aria-label={
              editingMessage
                ? t("chat-edit-attachment-unavailable")
                : t("chat-select-attachment")
            }
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
