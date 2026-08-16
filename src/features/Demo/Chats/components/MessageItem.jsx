import {
  IoCreateOutline,
  IoReturnUpBackOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import {
  formatFileSize,
  getSenderInitials,
  getSenderName,
} from "../utils/messageUtils";
import styles from "./Chats.module.css";

const formatMessageTime = (value, language) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return new Intl.DateTimeFormat(
    language,
    isToday
      ? { hour: "numeric", minute: "2-digit" }
      : {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        },
  ).format(date);
};

const formatFullMessageTime = (value, language) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};

const Attachment = ({ attachment, type, onOpenImage }) => {
  const { t, i18n } = useTranslation();

  if (!attachment?.fileUrl) {
    return null;
  }

  const mimeType = attachment.mimeType || "";

  if (type === "IMAGE" || mimeType.startsWith("image/")) {
    return (
      <button
        type="button"
        className={styles.imageAttachmentButton}
        onClick={() => onOpenImage(attachment)}
        aria-label={t("chat-open-image-attachment", {
          name: attachment.fileName || t("chat-image-attachment"),
        })}
      >
        <img
          src={attachment.fileUrl}
          alt={attachment.fileName || t("chat-image-attachment")}
          className={styles.imageAttachment}
          loading="lazy"
        />
      </button>
    );
  }

  if (type === "AUDIO" || mimeType.startsWith("audio/")) {
    return (
      <audio
        className={styles.audioAttachment}
        controls
        preload="metadata"
        aria-label={t("chat-audio-player", {
          name: attachment.fileName || t("chat-audio-attachment"),
        })}
      >
        <source src={attachment.fileUrl} type={attachment.mimeType} />
      </audio>
    );
  }

  return (
    <a
      href={attachment.fileUrl}
      target="_blank"
      rel="noreferrer"
      className={styles.fileAttachment}
      aria-label={t("chat-open-named-attachment", {
        name: attachment.fileName || t("chat-file-attachment"),
      })}
    >
      <span>{attachment.fileName || t("chat-open-attachment")}</span>
      {attachment.fileSize !== null &&
        attachment.fileSize !== undefined && (
          <small>
            {formatFileSize(attachment.fileSize, i18n.language)}
          </small>
        )}
    </a>
  );
};

const MessageItem = ({
  message,
  isMe,
  isPending,
  groupPosition = "single",
  isHighlighted = false,
  replySenderName,
  replyPreviewText,
  onOpenImage,
  onNavigateToReply,
  onReply,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language;
  const senderName = getSenderName(message, t("chat-unknown-member"));
  const isGroupStart =
    groupPosition === "single" || groupPosition === "first";
  const isGroupEnd =
    groupPosition === "single" || groupPosition === "last";

  return (
    <article
      className={`${styles.messageRow} ${
        isMe ? styles.rowMe : styles.rowThem
      } ${styles[`group-${groupPosition}`] || ""} ${
        isHighlighted ? styles.messageHighlighted : ""
      }`}
      data-message-id={message.id}
      data-group-position={groupPosition}
      tabIndex={-1}
      aria-label={
        isMe
          ? t("chat-message-from-you")
          : t("chat-message-from", { name: senderName })
      }
    >
      {!isMe && (
        <div
          className={`${styles.senderAvatarSmall} ${
            isGroupEnd ? "" : styles.senderAvatarPlaceholder
          }`}
          aria-hidden="true"
        >
          {isGroupEnd &&
            (message.sender.imagePath ? (
              <img src={message.sender.imagePath} alt="" />
            ) : (
              getSenderInitials(message)
            ))}
        </div>
      )}

      <div className={styles.messageContent}>
        {!isMe && isGroupStart && (
          <span className={styles.senderName}>{senderName}</span>
        )}

        <div className={styles.messageBubble}>
          {message.replyTo && (
            <button
              type="button"
              className={styles.replyReference}
              onClick={() => onNavigateToReply(message.replyTo?.id)}
              disabled={!message.replyTo?.id}
              title={t("chat-go-to-replied-message")}
              aria-label={t("chat-go-to-replied-message")}
            >
              <span>{replySenderName || t("chat-unknown-member")}</span>
              <p>
                {replyPreviewText ||
                  t("chat-referenced-message-unavailable")}
              </p>
            </button>
          )}

          {message.isDeleted ? (
            <p className={styles.deletedMessage}>
              {t("chat-message-deleted")}
            </p>
          ) : (
            <>
              {message.content && (
                <p className={styles.messageText}>{message.content}</p>
              )}
              <Attachment
                attachment={message.attachment}
                type={message.type}
                onOpenImage={onOpenImage}
              />
            </>
          )}

          <div className={styles.messageMeta}>
            {message.isEdited && !message.isDeleted && (
              <span>{t("chat-edited")}</span>
            )}
            <time
              dateTime={message.createdAt}
              aria-label={t("chat-message-sent-at", {
                date: formatFullMessageTime(message.createdAt, locale),
              })}
            >
              {formatMessageTime(message.createdAt, locale)}
            </time>
          </div>
        </div>

        {!message.isDeleted && (
          <div className={styles.messageActions}>
            <button
              type="button"
              onClick={() => onReply(message)}
              disabled={isPending}
              title={t("chat-reply")}
              aria-label={t("chat-reply")}
            >
              <IoReturnUpBackOutline />
            </button>

            {isMe && message.content && (
              <button
                type="button"
                onClick={() => onEdit(message)}
                disabled={isPending}
                title={t("chat-edit-message")}
                aria-label={t("chat-edit-message")}
              >
                <IoCreateOutline />
              </button>
            )}

            {isMe && (
              <button
                type="button"
                onClick={() => onDelete(message)}
                disabled={isPending}
                title={t("chat-delete-message")}
                aria-label={t("chat-delete-message")}
                className={styles.deleteAction}
              >
                <IoTrashOutline />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default MessageItem;
