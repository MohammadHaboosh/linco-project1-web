import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatComposer } from "../hooks/useChatComposer";
import { useChatScroll } from "../hooks/useChatScroll";
import { getDepartmentMemberName, getSenderName } from "../utils/messageUtils";
import ChatComposer from "./ChatComposer";
import ChatErrorStack from "./ChatErrorStack";
import ChatHeader from "./ChatHeader";
import ChatImagePreview from "./ChatImagePreview";
import ChatMessages from "./ChatMessages";
import styles from "./Chats.module.css";

const ChatArea = ({
  showHeader = true,
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
  const [openImage, setOpenImage] = useState(null);
  const isConnected = connectionStatus === "connected";
  const composer = useChatComposer({
    isConnected,
    isSending,
    isUploadingAttachment,
    pendingActionId,
    sendMessage,
    editMessage,
    deleteMessage,
    sendTypingStatus,
    clearActionError,
    discardPreparedAttachment,
    prepareAttachment,
  });
  const scroll = useChatScroll({
    messages,
    isLoadingHistory,
    isLoadingOlder,
    hasNextPage,
    loadOlderMessages,
  });
  const closeImagePreview = useCallback(() => setOpenImage(null), []);
  const chatErrors = useMemo(
    () => [historyError, connectionError, actionError],
    [actionError, connectionError, historyError],
  );
  const typingText = useMemo(() => {
    if (typingMemberIds.length === 0) {
      return "";
    }

    const onlineMembersById = new Map(
      onlineMembers.map((member) => [member.departmentMemberId, member]),
    );
    const senderNames = new Map();
    messages.forEach((message) => {
      if (message.sender?.id) {
        senderNames.set(message.sender.id, getSenderName(message, ""));
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

    return t("chat-people-typing", {
      count: typingMemberIds.length,
      formattedCount: new Intl.NumberFormat(
        i18n.resolvedLanguage || i18n.language,
      ).format(typingMemberIds.length),
    });
  }, [i18n.language, i18n.resolvedLanguage, messages, onlineMembers, t, typingMemberIds]);
  const actionProgressText = isSending
    ? t("chat-sending-message")
    : pendingActionId
      ? t("chat-updating-message")
      : "";

  return (
    <section
      className={styles.chatRoomWrapper}
      aria-label={t("department-chat")}
      aria-busy={isLoadingHistory || isSending || isUploadingAttachment}
    >
      {showHeader && (
        <ChatHeader
          connectionStatus={connectionStatus}
          currentDepartmentMemberId={currentDepartmentMemberId}
          onlineMembers={onlineMembers}
          retry={retry}
        />
      )}

      <ChatErrorStack
        errors={chatErrors}
        actionError={actionError}
        attachmentUploadStatus={composer.attachmentUploadStatus}
        retry={retry}
        retrySelectedAttachment={composer.retrySelectedAttachment}
        clearActionError={clearActionError}
      />

      <ChatMessages
        messages={messages}
        currentDepartmentMemberId={currentDepartmentMemberId}
        onlineMembers={onlineMembers}
        isLoadingHistory={isLoadingHistory}
        isLoadingOlder={isLoadingOlder}
        isSending={isSending}
        pendingActionId={pendingActionId}
        hasNextPage={hasNextPage}
        highlightedMessageId={scroll.highlightedMessageId}
        showScrollToBottom={scroll.showScrollToBottom}
        scrollAreaRef={scroll.scrollAreaRef}
        onScroll={scroll.handleScroll}
        onLoadOlder={scroll.handleLoadOlder}
        onScrollToBottom={scroll.handleScrollToBottom}
        onOpenImage={setOpenImage}
        onNavigateToReply={scroll.handleNavigateToReply}
        onReply={composer.handleReply}
        onEdit={composer.handleEdit}
        onDelete={composer.handleDelete}
      />

      <div className={styles.typingArea} role="status" aria-live="polite">
        {actionProgressText || typingText}
      </div>

      <ChatComposer isConnected={isConnected} {...composer} />

      <ChatImagePreview attachment={openImage} onClose={closeImagePreview} />
    </section>
  );
};

export default ChatArea;
