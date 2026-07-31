import { memo, useMemo } from "react";
import { IoArrowDownOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import {
  getDepartmentMemberName,
  shouldGroupMessages,
} from "../utils/messageUtils";
import { getMessagePreviewText } from "../utils/chatPresentationUtils";
import ChatEmptyState from "./ChatEmptyState";
import MessageItem from "./MessageItem";
import styles from "./Chats.module.css";

const ChatMessages = ({
  messages,
  currentDepartmentMemberId,
  onlineMembers,
  isLoadingHistory,
  isLoadingOlder,
  isSending,
  pendingActionId,
  hasNextPage,
  highlightedMessageId,
  showScrollToBottom,
  scrollAreaRef,
  onScroll,
  onLoadOlder,
  onScrollToBottom,
  onOpenImage,
  onNavigateToReply,
  onReply,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const onlineMembersById = useMemo(
    () =>
      new Map(
        onlineMembers.map((member) => [member.departmentMemberId, member]),
      ),
    [onlineMembers],
  );
  const messagesById = useMemo(
    () => new Map(messages.map((message) => [message.id, message])),
    [messages],
  );

  return (
    <div className={styles.messagesViewport}>
      <div
        className={styles.messagesScrollArea}
        ref={scrollAreaRef}
        onScroll={onScroll}
      >
        {hasNextPage && (
          <button
            type="button"
            className={styles.loadOlderButton}
            onClick={onLoadOlder}
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
            const referencedMessage = message.replyTo?.id
              ? messagesById.get(message.replyTo.id)
              : null;
            const replySenderId =
              message.replyTo?.sender?.id || referencedMessage?.sender?.id;
            const replySenderName =
              getDepartmentMemberName(message.replyTo?.sender, "") ||
              getDepartmentMemberName(referencedMessage?.sender, "") ||
              getDepartmentMemberName(
                onlineMembersById.get(replySenderId),
                "",
              );
            const replyPreviewText =
              getMessagePreviewText(message.replyTo, t) ||
              getMessagePreviewText(referencedMessage, t);

            return (
              <MessageItem
                key={message.id}
                message={message}
                groupPosition={groupPosition}
                isHighlighted={String(message.id) === highlightedMessageId}
                replySenderName={replySenderName}
                replyPreviewText={replyPreviewText}
                onOpenImage={onOpenImage}
                onNavigateToReply={onNavigateToReply}
                isMe={message.sender.id === currentDepartmentMemberId}
                isPending={Boolean(pendingActionId) || isSending}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })
        )}
      </div>

      {showScrollToBottom && (
        <button
          type="button"
          className={styles.scrollToBottomButton}
          onClick={onScrollToBottom}
          title={t("chat-jump-to-latest")}
          aria-label={t("chat-jump-to-latest")}
        >
          <IoArrowDownOutline aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default memo(ChatMessages);
